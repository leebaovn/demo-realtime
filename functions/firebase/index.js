const admin = require('firebase-admin')

const credentials = require('./credentials.json')

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: 'https://realtime-demo-chart.firebaseio.com',
})

module.exports = admin
