import React, { useState, useRef } from 'react'
import { Modal } from 'antd'
import './../Auth/auth.style.css'

function CreateRoom({ visible, setVisible, createRoom, loading }) {
  const titleRef = useRef('')
  const desRef = useRef('')

  return (
    <Modal
      title='Create room'
      visible={visible}
      onOk={() => {
        createRoom(titleRef.current.value, desRef.current.value)
        setVisible(false)
      }}
      confirmLoading={loading}
      okText='Create'
      onCancel={() => setVisible(false)}
      width={250}
    >
      <div className='label'>Title</div>
      <div className='input'>
        <input type='text' ref={titleRef} />
      </div>
      <div className='label'>Desciption</div>
      <div className='input'>
        <input type='text' ref={desRef} />
      </div>
    </Modal>
  )
}

export default CreateRoom
