require('dotenv').config();
const express = require('express');
const app = express();

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const admin = require("firebase-admin");
const serviceAccount = require("./revie-firebase-admin-config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET
});
const firebaseBucket = admin.storage().bucket();
const firebaseDb = admin.firestore();

const {getMediaList} = require('./middleware/media');

app.use(express.json());

app.post('/create-review', getMediaList, async (req, res) => {
  let mediaUrls = [];

  for(let path of req.mediaPaths){
    let currentFile = await new Promise((resolve, reject) => {
      firebaseBucket.upload(path, {public: true}, (err, file, apiResponse) => {
        if(err){
          reject(err);
          return;
        }
        resolve(file);
      });
    });

    mediaUrls.push({
      id: currentFile.id,
      url: currentFile.publicUrl()
    });
  }

  for(let path of req.mediaPaths){
    fs.unlinkSync(path);
  }

  const date = new Date();

  const docRef = firebaseDb.collection('reviews').doc(uuidv4());
  await docRef.set({
    ...req.formText,
    timestamp: date.toISOString(),
    media: [...mediaUrls]
  });
  res.send('review has been successfully created');
  return;
});


app.listen(3000, () => {
  console.log('app started on port 3000');
})
