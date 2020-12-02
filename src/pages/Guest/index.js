import React, { useEffect, useState } from 'react'
import './guest.style.css'
import { useParams } from 'react-router-dom'
import firebase, { firestore } from './../../firebase'
import confetti from 'canvas-confetti'
import fireworks from 'fireworks'
import ColumnChart from './../../components/ColumnChart'
import { pairData, LIST_ANSWERS } from './../../utils'
import axios from './../../apis'
function Guest() {
  const { roomId } = useParams()
  const questionRef = firestore.collection('questions')
  const answerRef = firestore.collection('answer')

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

  const listenForVoting = async () => {
    answerRef.onSnapshot(
      (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          console.log(change.doc.data().questionId, '1111')
          console.log(currentQuestion['id'], '22222')
          if (change.doc.data().questionId === currentQuestion['id']) {
            if (change.type === 'added') {
              const docAns = await answerRef
                .where('questionId', '==', currentQuestion.id || '')
                .get()
              const arrAns = docAns.docs.map((ans) => {
                return ans.data().answer
              })
              console.log(arrAns, '4444444')
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
            setAnswerList([answerA, answerB, answerC, answerD])
          }
        }
      })
    })
  }

  useEffect(() => {
    listenForVoting()
  }, [])
  useEffect(() => {
    listenForShowQuestion()
  }, [])
  return (
    <div className='mobile-wrapper'>
      <div className='mobile-header'>
        <div className='display-name'>Lee Bao</div>
        <div className='logout'>log out</div>
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
