import React, { useEffect, useState, useContext, useCallback } from 'react'
import './guest.style.css'
import { useParams, useHistory } from 'react-router-dom'
import { firestore } from './../../firebase'
import ColumnChart from './../../components/ColumnChart'
import {
  pairData,
  LIST_ANSWERS,
  ANSWER_COLORS,
  configConfetti,
  countAns,
} from './../../utils'
import guestContext from './../../contexts/guest/guest-context'
import axios from './../../apis'
import Confetti from 'react-dom-confetti'
import { Button } from 'antd'
import Confetti2 from 'react-confetti'
import notification, { typeNotificaton } from './../../components/Notification'
function Guest() {
  const { roomId } = useParams()
  const history = useHistory()
  const questionRef = firestore.collection('questions')
  const answerRef = firestore.collection('answer')
  const [{ displayName }, guestDispatch] = useContext(guestContext)
  const [data, setData] = useState({})
  const [currentQuestion, setcurrentQuestion] = useState({})
  const [answerList, setAnswerList] = useState([])
  const [timing, setTiming] = useState(Number)
  const [loading, setLoading] = useState(false)
  const [currentAns, setCurrentAns] = useState('')
  // const clearData = () => {
  //   setData([])
  // }
  if (!window.localStorage.getItem('guestId')) {
    history.push(`/roomplay/${roomId}/login`)
  }

  const handleAns = async (ans) => {
    if (timing <= 0) {
      notification(typeNotificaton.error, 'Timeout')
      return
    }
    if (currentAns) return
    try {
      setCurrentAns(ans)
      await axios.post(`/answer/${currentQuestion.id}`, {
        answer: ans,
      })
    } catch (err) {
      notification(typeNotificaton.error, 'Error occurs')
    }
  }
  useEffect(() => {
    listenForShowQuestion()
  }, [])

  const listenForVoting = useCallback(async () => {
    if (currentQuestion.id) {
      answerRef.where('questionId', '==', currentQuestion.id || '').onSnapshot(
        (snapshot) => {
          // if (timing < 6) return
          snapshot.docChanges().forEach(async (change) => {
            if (change.doc.data().questionId === currentQuestion['id']) {
              if (change.type === 'added') {
                const docAns = await answerRef
                  .where('questionId', '==', currentQuestion.id || '')
                  .get()
                const arrAns = docAns.docs.map((ans) => {
                  return ans.data().answer
                })
                const resultArr = pairData(arrAns)
                setData(resultArr)
              }
            }
          })
        },
        (err) => console.log(err)
      )
    }
  }, [currentQuestion.id])
  const listenForShowQuestion = useCallback(async () => {
    questionRef.where('roomId', '==', roomId).onSnapshot((snapshot) => {
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
              setTiming(responseTime)
              setcurrentQuestion({
                question: question,
                id: change.doc.id,
              })
              setData([])
              setCurrentAns('')
              setAnswerList([answerA, answerB, answerC, answerD])
            }
          }
        }
      })
    })
  }, [questionRef])

  useEffect(() => {
    listenForVoting()
  }, [currentQuestion])

  useEffect(() => {
    // if (timing < 6) {
    //   clearData()
    // }
    const timingCount = setInterval(() => {
      setTiming((pre) => pre - 1)
    }, 1000)
    if (timing === 0) {
      clearInterval(timingCount)
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    }
    return () => clearInterval(timingCount)
  }, [timing])

  const logout = () => {
    guestDispatch({ type: 'LOGOUT' })
    history.push(`/roomplay/${roomId}/login`)
  }
  return (
    <div className='mobile-wrapper'>
      <Confetti2 numberOfPieces={400} recycle={loading} friction={1} />
      <div className='mobile-header'>
        <div className='display-name'>{displayName}</div>
        <div className='logout'>
          <Button onClick={logout}>ログアウト</Button>
        </div>
      </div>
      <div className='chart'>
        <ColumnChart data={data} label={LIST_ANSWERS} />
      </div>
      {!timing && <div className='message'>Please wait the host</div>}
      <div className='response-time-section'>
        {currentQuestion.id && (
          <div
            className='response-time'
            style={
              timing <= 5
                ? { backgroundColor: '#cc4747' }
                : { backgroundColor: '#03994c' }
            }
          >
            {timing}
          </div>
        )}
        <div className='image'></div>

        <div className='ans-count'>
          <div className='count'>{countAns(data)}</div>
          <div>answers</div>
        </div>
      </div>

      {currentQuestion.id && (
        <div className='question'>Question: {currentQuestion.question}</div>
      )}
      <div className='answer-section'>
        <ul className='ans-list'>
          {answerList.map((ans, idx) => (
            <li
              key={idx}
              className='ans-item'
              style={{ backgroundColor: ANSWER_COLORS[idx] }}
              onClick={() => handleAns(LIST_ANSWERS[idx])}
            >
              {currentAns && LIST_ANSWERS[idx] !== currentAns && (
                <div className='overlay'></div>
              )}
              <Confetti key={idx} active={currentAns} config={configConfetti} />
              {LIST_ANSWERS[idx]}. {ans}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Guest
