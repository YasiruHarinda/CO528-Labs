const admin = require('firebase-admin');

let serviceAccount;

if (process.env.FIREBASE_KEY_JSON) {
  // On Render — reads from environment variable
  serviceAccount = JSON.parse(process.env.FIREBASE_KEY_JSON);
} else {
  // Local — reads from file
  serviceAccount = require('./firebase-key.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = { db, admin };