const functions = require('firebase-functions');
const admin = require('firebase-admin');

// require('dotenv').config();
const express = require('express');

const cors = require('cors');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: '*' }));

app.get('/questions', async (req, res) => {
  const questionList = await db.collection('questions').get();
  if (!questionList.empty) {
    const list = questionList.forEach((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    res.send(200).json({ data: list });
  }
});



exports.api = functions.https.onRequest(app);
