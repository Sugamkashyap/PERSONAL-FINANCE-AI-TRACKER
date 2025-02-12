const { getAdmin } = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await getAdmin().auth().verifyIdToken(token);
    
    req.user = {
      _id: decodedToken.uid,  // Important: This needs to match with the budget model
      email: decodedToken.email
    };
    
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};