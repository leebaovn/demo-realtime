import React, { useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import axios from './../../apis'
import './auth.style.css'
function Guest() {
  const history = useHistory()
  const { roomId } = useParams()
  const emailRef = useRef('')
  const nameRef = useRef('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const newGuest = await axios.post(`/guest/${roomId}`, {
        email: emailRef.current.value,
        displayName: nameRef.current.value,
      })
      localStorage.setItem('guestId', newGuest.data)
      history.push(`/roomplay/${roomId}`)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className='container'>
      <div className='box'>
        <h2 className='title' style={{ marginTop: '1rem' }}>
          Please enter your information
        </h2>
        <form onSubmit={handleLogin}>
          <div className='form-field'>
            <div className='label'>Email</div>
            <div className='input'>
              <input type='email' ref={emailRef} />
            </div>
          </div>
          <div className='form-field'>
            <div className='label'>Username</div>
            <div className='input'>
              <input type='text' ref={nameRef} />
            </div>
          </div>
          <div className='btn-section' style={{ marginBottom: '1rem' }}>
            <input type='submit' value='Check in' className='btn btn-default' />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Guest
