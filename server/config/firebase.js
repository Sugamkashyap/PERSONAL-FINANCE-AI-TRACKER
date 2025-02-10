const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Get the service account key file path from environment variables
const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

// Initialize Firebase Admin
const initializeFirebase = () => {
  try {
    // Initialize the app if it hasn't been initialized already
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath)
      });
      console.log('Firebase Admin SDK initialized successfully');
    }
    return admin;
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    throw error;
  }
};

module.exports = {
  admin,
  initializeFirebase
};
