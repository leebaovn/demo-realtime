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

app.post('/createroom', async (req, res) => {
  const { title, description } = req.body;
  await db.collection('room').add({
    title,
    description,
    members: [],
    answers: [],
    questions: [],
  });
  res.send(200).json({ data: 'Success' });
});

app.post('/answer/:roomId', async (req, res) => {
  const roomId = req.params.roomId;
  const { answer, username } = req.body;
  const roomRef = await db.collection('room').doc(roomId).get();
  if (roomRef.exists) {
    const oldAns = roomRef.data().answers;
    const newAns = [...oldAns, { answer, username }];
    db.collection('room').doc(roomId).update({
      answers: newAns,
    });
  } else {
    res.send(404).json({ message: 'Room not found!' });
  }
});

exports.api = functions.https.onRequest(app);
