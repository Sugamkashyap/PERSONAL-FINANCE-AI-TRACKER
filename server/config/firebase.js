const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

let firebaseAdmin = null;

const initializeFirebase = () => {
  if (!firebaseAdmin) {
    try {
      const serviceAccountPath = path.resolve(
        process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
        path.join(__dirname, '../credentials/serviceAccountKey.json')
      );
      
      const credential = admin.credential.cert(require(serviceAccountPath));
      
      firebaseAdmin = admin.initializeApp({
        credential
      });
      
      console.log('Firebase Admin SDK initialized successfully');
      return firebaseAdmin;
    } catch (error) {
      console.error('Error initializing Firebase Admin SDK:', error);
      throw error;
    }
  }
  return firebaseAdmin;
};

module.exports = {
  initializeFirebase,
  getAdmin: () => firebaseAdmin || initializeFirebase()
};
