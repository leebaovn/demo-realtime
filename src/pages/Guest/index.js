import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from 'react'
import './guest.style.css'
import { Link, useParams, useHistory } from 'react-router-dom'
import firebase, { firestore } from './../../firebase'
import confetti from 'canvas-confetti'
import fireworks from 'fireworks'
import ColumnChart from './../../components/ColumnChart'
import { pairData, LIST_ANSWERS, ANSWER_COLORS } from './../../utils'
import guestContext from './../../contexts/guest/guest-context'
import axios from './../../apis'
import { Button } from 'antd'
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
  const clearData = () => {
    setcurrentQuestion({})
    setAnswerList([])
    setData([])
  }

  const countAns = () => {
    let totalCount = 0
    for (const count in data) {
      totalCount += data[count]
    }
    return totalCount
  }

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
  const listenForVoting = useCallback(async () => {
    if (currentQuestion.id) {
      answerRef.where('questionId', '==', currentQuestion.id || '').onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (currentQuestion.id) {
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
    const timingCount = setInterval(() => {
      setTiming((pre) => pre - 1)
    }, 1000)
    if (timing === 0) clearInterval(timingCount)
    return () => clearInterval(timingCount)
  }, [])
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
      <div className='chart'>
        <ColumnChart data={data} label={LIST_ANSWERS} />
      </div>
      <div className='response-time-section'>
        {currentQuestion.id && <div className='response-time'>{timing}</div>}
        <div className='image'></div>
        <div className='ans-count'>
          <div className='count'>{countAns() || 0}</div>
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
              {LIST_ANSWERS[idx]}. {ans}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Guest
