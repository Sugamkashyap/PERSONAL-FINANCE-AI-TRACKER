const { getAdmin } = require('../config/firebase');

// Example function to demonstrate Firebase Admin usage
async function firebaseExample() {
  try {
    // Get Firebase Admin instance
    const admin = getAdmin();
    
    // Example: Create a new user
    const userRecord = await admin.auth().createUser({
      email: 'user@example.com',
      password: 'secretPassword',
    });
    console.log('Successfully created new user:', userRecord.uid);
    
    // Example: Get user by email
    const userByEmail = await admin.auth().getUserByEmail('user@example.com');
    console.log('User details:', userByEmail);
    
    // Example: Verify ID token
    async function verifyUserToken(idToken) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log('Decoded token:', decodedToken);
        return decodedToken;
      } catch (error) {
        console.error('Error verifying token:', error);
        throw error;
      }
    }
    
  } catch (error) {
    console.error('Firebase operation failed:', error);
    throw error;
  }
}

module.exports = {
  firebaseExample
};
