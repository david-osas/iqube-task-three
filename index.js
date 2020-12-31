require('dotenv').config();
const express = require('express');
const app = express();
let {firebaseConfig} = require('utils.js');

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
