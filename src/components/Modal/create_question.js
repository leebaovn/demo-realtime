import React, { useState, useRef } from 'react'
import { Modal } from 'antd'
import './../Auth/auth.style.css'

function CreateQuestion({ visible, setVisible, createQuestion, loading }) {
  const questionRef = useRef('')
  const restimeRef = useRef(null)
  const ansARef = useRef('')
  const ansBRef = useRef('')
  const ansCRef = useRef('')
  const ansDRef = useRef('')

  const clearRef = () => {
    questionRef.current.value = ''
    restimeRef.current.value = ''
    ansARef.current.value = ''
    ansBRef.current.value = ''
    ansCRef.current.value = ''
    ansDRef.current.value = ''
  }
  const handleOk = () => {
    const questionData = {
      question: questionRef.current.value,
      responseTime: restimeRef.current.value,
      answerA: ansARef.current.value,
      answerB: ansBRef.current.value,
      answerC: ansCRef.current.value,
      answerD: ansDRef.current.value,
    }
    createQuestion(questionData)
    clearRef()
    setVisible(false)
  }

  return (
    <Modal
      title='Create question'
      visible={visible}
      onOk={handleOk}
      confirmLoading={loading}
      okText='Create'
      onCancel={() => setVisible(false)}
      width={450}
    >
      <div className='label'>Question</div>
      <div className='input' style={{ width: '100%' }}>
        <textarea ref={questionRef} style={{ width: '100%' }} />
      </div>
      <div className='label'>Response time</div>
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
      <div className='label'>Answer A</div>
      <div className='input'>
        <input type='text' ref={ansARef} style={{ width: '100%' }} />
      </div>
      <div className='label'>Answer B</div>
      <div className='input'>
        <input type='text' ref={ansBRef} style={{ width: '100%' }} />
      </div>
      <div className='label'>Answer C</div>
      <div className='input'>
        <input type='text' ref={ansCRef} style={{ width: '100%' }} />
      </div>
      <div className='label'>Answer D</div>
      <div className='input'>
        <input type='text' ref={ansDRef} style={{ width: '100%' }} />
      </div>
    </Modal>
  )
}

export default CreateQuestion
