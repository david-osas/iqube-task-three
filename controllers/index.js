const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const admin = require("firebase-admin");
const serviceAccount = require("../revie-firebase-admin-config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET,
});
const firebaseBucket = admin.storage().bucket();
const firebaseDb = admin.firestore();

exports.createReview = async (req, res) => {
  const date = new Date();
  const docRef = firebaseDb.collection("reviews").doc(uuidv4());
  await docRef.set({
    ...req.formText,
    helpful: parseInt(req.formText.helpful),
    timestamp: date.toISOString(),
    media: [],
  });
  res.status(200).send("review has been successfully created");

  let mediaUrls = [];
  for (let path of req.mediaPaths) {
    let currentFile = await new Promise((resolve, reject) => {
      firebaseBucket.upload(
        path,
        { public: true },
        (err, file, apiResponse) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(file);
        }
      );
    });

    mediaUrls.push({
      id: currentFile.id,
      url: currentFile.publicUrl(),
    });
  }

  docRef.update({ media: [...mediaUrls] });
  for (let path of req.mediaPaths) {
    fs.unlink(path, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  return;
};

exports.getAllReviews = async (req, res) => {
  let reviews = [];

  const snapshot = await firebaseDb.collection("reviews").get();
  snapshot.forEach((doc) => {
    reviews.push({ id: doc.id, data: doc.data() });
  });

  let query = req.query;

  if (query.organize) {
    let key;
    switch (query.organize) {
      case "helpful":
        key = "helpful";
        break;

      case "recent":
        key = "timestamp";
        break;

      default:
        key = "timestamp";
    }
    reviews.sort((a, b) => {
      if (a.data[key] > b.data[key]) {
        return -1;
      } else if (a.data[key] < b.data[key]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  res.json(reviews);
};

exports.deleteReview = async (req, res) => {
  const id = req.body.id;

  if (!id) {
    return res.status(406).send("No Id was passed");
  }
  const docRef = firebaseDb.collection("reviews").doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return res.status(404).send("Invalid Id, no review has that Id");
  }

  const data = doc.data();
  for (let mediaObj of data.media) {
    let file = firebaseBucket.file(mediaObj.id);
    try {
      file.delete();
    } catch (err) {
      console.log(err);
    }
  }

  const deleteRes = await docRef.delete();

  return res.send("review has been successfully deleted");
};

exports.updateReview = async (req, res) => {
  const id = req.body.id;

  if (!id) {
    return res.status(406).send("No Id was passed");
  }
  const docRef = firebaseDb.collection("reviews").doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return res.status(404).send("Invalid Id, no review has that Id");
  }
  const updateRes = await docRef.update({ helpful: doc.data().helpful + 1 });

  return res.status(200).send("review has been successfully marked helpful");
};

exports.getOneReview = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(406).send("No Id was passed");
  }
  const doc = await firebaseDb.collection("reviews").doc(id).get();

  if (!doc.exists) {
    return res.status(404).send("Invalid Id, no review has that Id");
  }
  return res.status(200).json(doc.data());
};
