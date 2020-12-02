import React, { useRef } from 'react'
import { useHistory } from 'react-router-dom'

import './../../components/Auth/auth.style.css'
function Guest() {
  const history = useHistory()
  const emailRef = useRef('')
  const pwdRef = useRef('')

  const handleLogin = () => {}
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
              <input type='password' ref={pwdRef} />
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
