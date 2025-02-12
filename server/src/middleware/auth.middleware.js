const { getAdmin } = require('../../config/firebase');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const admin = getAdmin();
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Find or create user in our database
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      user = await User.create({
        email: decodedToken.email,
        firebaseUid: decodedToken.uid,
        displayName: decodedToken.name || decodedToken.email.split('@')[0]
      });
    }

    req.user = {
      uid: user.firebaseUid,
      email: user.email,
      _id: user._id
    };
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
