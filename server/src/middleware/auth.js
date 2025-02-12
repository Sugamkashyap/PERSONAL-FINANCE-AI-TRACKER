const admin = require('firebase-admin');
<<<<<<< HEAD
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
=======

const auth = async (req, res, next) => {
>>>>>>> 24e1bac868a901d4c1fdf4d939fef715c76f9c73
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
<<<<<<< HEAD
    
    // Find or create user in our database
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      user = await User.create({
        email: decodedToken.email,
        firebaseUid: decodedToken.uid,
        displayName: decodedToken.name || decodedToken.email.split('@')[0]
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
=======
    req.user = {
      _id: decodedToken.uid,
      email: decodedToken.email
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
>>>>>>> 24e1bac868a901d4c1fdf4d939fef715c76f9c73
    res.status(401).json({ message: 'Invalid token' });
  }
};

<<<<<<< HEAD
module.exports = authMiddleware; 
=======
module.exports = auth;
>>>>>>> 24e1bac868a901d4c1fdf4d939fef715c76f9c73
