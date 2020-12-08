import React, { useState, useRef, useEffect } from 'react'
import { Modal } from 'antd'
import './../Auth/auth.style.css'

function CreateQuestion({ visible, setVisible, createQuestion, loading }) {
  const questionRef = useRef('')
  const restimeRef = useRef(null)
  const ansARef = useRef('')
  const ansBRef = useRef('')
  const ansCRef = useRef('')
  const ansDRef = useRef('')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (visible) {
      questionRef.current.focus()
    }
  }, [visible])

  const clearRef = () => {
    questionRef.current.value = ''
    restimeRef.current.value = ''
    ansARef.current.value = ''
    ansBRef.current.value = ''
    ansCRef.current.value = ''
    ansDRef.current.value = ''
  }

  const onClose = () => {
    setError(null)
    setVisible(false)
  }

  const handleOk = () => {
    if (!questionRef.current.value) {
      questionRef.current.focus()
      setError('Pls fill out')
      return
    }
    if (!restimeRef.current.value) {
      restimeRef.current.focus()
      setError('Pls fill out')
      return
    }
    if (!ansARef.current.value) {
      ansARef.current.focus()
      setError('Pls fill out')
      return
    }
    if (!ansBRef.current.value) {
      ansBRef.current.focus()
      setError('Pls fill out')
      return
    }
    if (!ansCRef.current.value) {
      ansCRef.current.focus()
      setError('Pls fill out')
      return
    }
    if (!ansDRef.current.value) {
      ansDRef.current.focus()
      setError('Pls fill out')
      return
    }

    const questionData = {
      question: questionRef.current.value,
      responseTime: restimeRef.current.value,
      answerA: ansARef.current.value,
      answerB: ansBRef.current.value,
      answerC: ansCRef.current.value,
      answerD: ansDRef.current.value,
    }

    createQuestion(questionData)
    if (!loading) {
      clearRef()
      onClose()
    }
    setError('')
  }

  return (
    <Modal
      title='質問の追加'
      visible={visible}
      onOk={handleOk}
      loading={loading}
      confirmLoading={loading}
      okText='追加'
      cancelText='キャンセル'
      onCancel={onClose}
      width={450}
    >
      <div className='error'>{error}</div>
      <div className='label'>質問</div>
      <div className='input' style={{ width: '100%' }}>
        <textarea ref={questionRef} style={{ width: '100%' }} />
      </div>
      <div className='label'>返信時間(秒)</div>
      <div className='input' style={{ width: '100%' }}>
        <input
          type='number'
          onKeyDown={(e) => {
            if (e.key === 'e' || e.key === 'E') {
              e.preventDefault()
            }
          }}
          ref={restimeRef}
          style={{ width: '100%' }}
        />
      </div>
      <div className='label'>回答A</div>
      <div className='input'>
        <input type='text' ref={ansARef} style={{ width: '100%' }} />
      </div>
      <div className='label'>回答B</div>
      <div className='input'>
        <input type='text' ref={ansBRef} style={{ width: '100%' }} />
      </div>
      <div className='label'>回答C</div>
      <div className='input'>
        <input type='text' ref={ansCRef} style={{ width: '100%' }} />
      </div>
      <div className='label'>回答D</div>
      <div className='input'>
        <input type='text' ref={ansDRef} style={{ width: '100%' }} />
      </div>
    </Modal>
  )
}

export default CreateQuestion
