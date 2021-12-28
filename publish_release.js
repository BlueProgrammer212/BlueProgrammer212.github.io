let arguments = process.argv.slice(2);
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app'),
      { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore'),
      serviceAccount = require('./serviceAccount.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const docRef = db.collection('download_releases');
docRef.add({
  description: arguments[1],
  name: arguments[0],
  version: arguments[2]
})