import React, { useEffect, useRef } from 'react'
import './auth.style.css'
import { Link, useHistory } from 'react-router-dom'
import firebase, { auth } from './../../firebase'
import { GoogleOutlined, GooglePlusOutlined } from '@ant-design/icons'
function Login() {
  const history = useHistory()
  const emailRef = useRef('')
  const pwdRef = useRef('')

  const handleLogin = (e) => {
    e.preventDefault()
    firebase
      .auth()
      .signInWithEmailAndPassword(emailRef.current.value, pwdRef.current.value)
      .then((user) => {
        history.push('/')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleGoogeLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (result) => {
        // var token = result.credential.accessToken
        // localStorage.setItem('@token', token)

        history.push('/')
      })
      .catch((error) => {
        console.log(`Error on signing in`, error)
      })
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
        <hr width='50%' />
        <div className='social-login'>
          <button onClick={handleGoogeLogin} className='login-button'>
            <GooglePlusOutlined />
            Sign in with Google
          </button>
        </div>
        <div className='text-direct'>
          Don't have an account ? <Link to='/signup'>Sign up now</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
