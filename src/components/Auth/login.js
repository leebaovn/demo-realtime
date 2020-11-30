import React, { useRef } from 'react'
import './auth.style.css'
import { Link } from 'react-router-dom'
function Login() {
  const emailRef = useRef('')
  const pwdRef = useRef('')
  const handleLogin = (e) => {
    e.preventDefault()
  }
  return (
    <div className='container'>
      <div className='box'>
        <h2 className='title'>ログイン</h2>
        <form onSubmit={handleLogin}>
          <div className='form-field'>
            <div className='label'>Email</div>
            <div className='input'>
              <input type='email' ref={emailRef} />
            </div>
          </div>
          <div className='form-field'>
            <div className='label'>Password</div>
            <div className='input'>
              <input type='password' ref={pwdRef} />
            </div>
          </div>
          <div className='btn-section'>
            <input type='submit' value='Login' className='btn btn-default' />
          </div>
        </form>
        <div className='text-direct'>
          Don't have an account ? <Link to='/signup'>Sign up now</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
