import React, { useEffect, useState, useContext } from 'react'
import './guest.style.css'
import { Link, useParams, useHistory } from 'react-router-dom'
import firebase, { firestore } from './../../firebase'
import confetti from 'canvas-confetti'
import fireworks from 'fireworks'
import ColumnChart from './../../components/ColumnChart'
import { pairData, LIST_ANSWERS } from './../../utils'
import guestContext from './../../contexts/guest/guest-context'
import axios from './../../apis'
import { Button } from 'antd'
function Guest() {
  const { roomId } = useParams()
  const history = useHistory()
  const questionRef = firestore.collection('questions')
  const answerRef = firestore.collection('answer')
  const [{ displayName }, guestDispatch] = useContext(guestContext)

  const [data, setData] = useState([])
  const [currentQuestion, setcurrentQuestion] = useState({})
  const [answerList, setAnswerList] = useState([])

  const handleAns = async (ans) => {
    const guestId = localStorage.getItem('guestId')
    await axios.post(`/answer/${currentQuestion.id}`, {
      answer: ans,
      guestId,
    })
  }
  useEffect(() => {
    listenForShowQuestion()
  }, [])

  const listenForVoting = async () => {
    answerRef.onSnapshot(
      (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          console.log('check realtime', change.doc.data())
          console.log('check question', currentQuestion['id'])
          if (change.doc.data().questionId === currentQuestion['id']) {
            console.log('check current question =>>> passs')
            if (change.type === 'added') {
              console.log('check type add answer =>>>> pass')
              const docAns = await answerRef
                .where('questionId', '==', currentQuestion.id || '')
                .get()
              console.log('imhere')
              const arrAns = docAns.docs.map((ans) => {
                return ans.data().answer
              })
              console.log('imhere421')
              const resultArr = pairData(arrAns)
              setData(resultArr)
            }
          }
        })
      },
      (err) => console.log(err)
    )
  }

  const listenForShowQuestion = async () => {
    questionRef.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          if (change.doc.data().roomId === roomId) {
            const {
              question,
              answerA,
              answerB,
              answerC,
              answerD,
              responseTime,
            } = change.doc.data()

            if (question) {
              setcurrentQuestion({
                question: question,
                id: change.doc.id,
                responseTime,
              })
              setData([])
              setAnswerList([answerA, answerB, answerC, answerD])
            }
          }
        }
      })
    })
  }

  useEffect(() => {
    listenForVoting()
  }, [currentQuestion])

  const logout = () => {
    guestDispatch({ type: 'LOGOUT' })
    history.push(`/roomplay/${roomId}/login`)
  }
  return (
    <div className='mobile-wrapper'>
      <div className='mobile-header'>
        <div className='display-name'>{displayName}</div>
        <div className='logout'>
          <Button onClick={logout}>Log out</Button>
        </div>
      </div>
      <div className='response-time'>{currentQuestion.responseTime}</div>
      <div className='chart'>
        <ColumnChart data={data} label={LIST_ANSWERS} />
      </div>
      <div className='question'>{currentQuestion.question}</div>
      <div className='answer-section'>
        <ul className='ans-list'>
          {answerList.map((ans, idx) => (
            <li
              key={idx}
              className='ans-item'
              onClick={() => handleAns(LIST_ANSWERS[idx])}
            >
              {LIST_ANSWERS[idx]}. {ans}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Guest
