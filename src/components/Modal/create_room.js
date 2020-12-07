import React, { useState, useRef, useEffect } from 'react'
import { Modal } from 'antd'
import './../Auth/auth.style.css'

function CreateRoom({ visible, setVisible, createRoom, loading }) {
  const titleRef = useRef('')
  const desRef = useRef('')
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('imhere')

    if (titleRef.current) {
      titleRef.current.focus()
    }
  }, [])
  return (
    <Modal
      title='Create room'
      visible={visible}
      onOk={() => {
        if (!titleRef.current.value || !desRef.current.value) {
          setError('You need to fill out information')
          return
        }
        setError('')
        createRoom(titleRef.current.value, desRef.current.value)
        titleRef.current.value = ''
        desRef.current.value = ''
        setVisible(false)
      }}
      confirmLoading={loading}
      okText='Create'
      onCancel={() => setVisible(false)}
      width={300}
    >
      <div className='error'>{error}</div>
      <div className='label'>Title</div>
      <div className='input'>
        <input type='text' ref={titleRef} style={{ width: '100%' }} />
      </div>
      <div className='label' style={{ marginTop: '1rem' }}>
        Desciption
      </div>
      <div className='input'>
        <input type='text' ref={desRef} style={{ width: '100%' }} />
      </div>
    </Modal>
  )
}

export default CreateRoom
