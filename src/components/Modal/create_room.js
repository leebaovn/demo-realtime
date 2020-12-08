import React, { useState, useRef, useEffect } from 'react'
import { Modal } from 'antd'
import './../Auth/auth.style.css'

function CreateRoom({ visible, setVisible, createRoom, loading }) {
  const titleRef = useRef('')
  const desRef = useRef('')
  const [error, setError] = useState('')

  const clearRef = () => {
    titleRef.current.value = ''
    desRef.current.value = ''
  }

  const onClose = () => {
    setVisible(false)
    setError('')
  }

  const handleOk = () => {
    if (!titleRef.current.value || !desRef.current.value) {
      setError('You need to fill out information')
      titleRef.current.focus()
      return
    }
    createRoom(titleRef.current.value, desRef.current.value)
    clearRef()
    onClose()
  }

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus()
    }
  }, [visible])
  return (
    <Modal
      title='アンケートの追加'
      okText='追 加'
      cancelText='キャンセル'
      visible={visible}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      width={300}
    >
      <div className='error'>{error}</div>
      <div className='label'>アンケート名</div>
      <div className='input'>
        <input type='text' ref={titleRef} style={{ width: '100%' }} />
      </div>
      <div className='label' style={{ marginTop: '1rem' }}>
        説明
      </div>
      <div className='input'>
        <input type='text' ref={desRef} style={{ width: '100%' }} />
      </div>
    </Modal>
  )
}

export default CreateRoom
