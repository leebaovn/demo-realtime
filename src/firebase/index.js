import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/performance'
import 'firebase/analytics'
var firebaseConfig = {
  apiKey: 'AIzaSyAMzMXAZpb7ZYFBm-ZO5-NcxpB9Ahtrex4',
  authDomain: 'realtime-demo-chart.firebaseapp.com',
  databaseURL: 'https://realtime-demo-chart.firebaseio.com',
  projectId: 'realtime-demo-chart',
  storageBucket: 'realtime-demo-chart.appspot.com',
  messagingSenderId: '742763001407',
  appId: '1:742763001407:web:4d33fade4dfed694496a8a',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const firestore = firebase.firestore()
const auth = firebase.auth()

const performance = firebase.performance()
firebase.analytics()
export { performance, auth, firestore, firebase as default }
