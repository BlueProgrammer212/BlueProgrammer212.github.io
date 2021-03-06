let arguments = process.argv.slice(2);
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app'),
      { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore'),
      serviceAccount = require('./serviceAccount.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const docRef = db.collection('download_releases');
let description_string = "";
for (let i = 1; i < arguments.length - 2; ++i) {
   description_string += " " + arguments[i];
}

docRef.add({
  description: description_string,
  name: arguments[0],
  version: arguments[arguments.length - 2],
  downloadLink: arguments[arguments.length - 1]
}).then((a) => {
   console.log("Added the document to the database successfully.", a)
})