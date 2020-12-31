require('dotenv').config();
const express = require('express');
const app = express();

const admin = require("firebase-admin");
const serviceAccount = require("./revie-firebase-admin-config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.post('/create-review', upload.any(), (req, res) => {
  console.log(req.files);
  console.log(req.body);

  res.send('osas welcome');
});


app.listen(3000, () => {
  console.log('app started on port 3000');
})
