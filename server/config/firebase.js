const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const initializeFirebase = () => {
  try {
    const serviceAccount = require(path.join(__dirname, '../credentials/serviceAccountKey.json'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized');
    return admin;
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    throw error;
  }
};

module.exports = { initializeFirebase };
