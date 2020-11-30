import './App.css'
import ColumnChart from './components/ColumnChart'
import firebase, { firestore } from './firebase'
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import confetti from 'canvas-confetti'
import fireworks from 'fireworks'
import Login from './components/Auth/login'
import Signup from './components/Auth/signin'
import Room from './pages/Room'
import RoomDetail from './pages/Room/room-detail'
import Layout from './components/Layout'
const LIST_ANSWERS = ['A', 'B', 'C', 'D']

const pairData = (arrData) => {
  let arr = {}
  LIST_ANSWERS.forEach((ans) => {
    arr[ans] = 0
  })
  arrData?.forEach((ans) => {
    if (LIST_ANSWERS.includes(ans)) {
      arr[ans] = arr[ans] + 1
    }
  })
  return arr
}
const getLocation = (latestVote) => {
  return ['40%', '30%']
}
function App() {
  const roomRef = firestore.collection('room')
  const [data, setData] = useState([])

  // useEffect(() => {
  //   listenForVoting()
  // }, [])

  const listenForVoting = async () => {
    roomRef.onSnapshot(
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const newData = change.doc.data().answers
          const arrAns = pairData(newData)
          setData(arrAns)
          const loc = getLocation(newData[newData.length - 1])
          fireworks({
            x: loc[0],
            y: loc[1],
            colors: ['#cc3333', '#4CAF50', '#81C784'],
          })

          // confetti({
          //   particleCount: 10,
          //   spread: 10,
          //   origin: { y: 0.6 }
          // });
        })
      },
      (err) => console.log(err)
    )
  }
  const handleAns = async (ans) => {
    const data = await firestore
      .collection('room')
      .doc('1zFvzHq93RiczxRtrnPM')
      .get()
    const answerList = data.data().answers
    answerList.push(ans)
    await firestore.collection('room').doc('1zFvzHq93RiczxRtrnPM').update({
      answers: answerList,
    })
  }
  return (
    // <div className='App'>
    //   <ColumnChart data={data} label={LIST_ANSWERS} />
    //   <div
    //     style={{
    //       display: 'flex',
    //       justifyContent: 'space-between',
    //       margin: 'auto',
    //       width: '80%',
    //       maxWidth: 600,
    //     }}
    //   >
    //     {LIST_ANSWERS.map((ans, ind) => (
    //       <div
    //         key={ind}
    //         onClick={() => handleAns(ans)}
    //         style={{
    //           padding: '8px 16px',
    //           border: '1px solid #000',
    //           width: '100px',
    //           cursor: 'pointer',
    //         }}
    //       >
    //         {ans}
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <Router>
      <Switch>
        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/signup'>
          <Signup />
        </Route>
        <Route path='/:id'>
          <Layout>
            <RoomDetail />
          </Layout>
        </Route>
        <Route path='/'>
          <Layout>
            <Room />
          </Layout>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
