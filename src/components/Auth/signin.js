import React, { useRef } from 'react'
import './auth.style.css'
import { Link, useHistory } from 'react-router-dom'
import firebase from './../../firebase'
import notification, { typeNotificaton } from './../Notification'
function Signin() {
  const history = useHistory()
  const emailRef = useRef('')
  const pwdRef = useRef('')
  const confirmpwdRef = useRef('')
  const usernameRef = useRef('')
  const clearRef = () => {
    emailRef.current.value = ''
    pwdRef.current.value = ''
    confirmpwdRef.current.value = ''
    usernameRef.current.value = ''
  }
  const handleSignup = async (e) => {
    const { value: pwd } = pwdRef.current
    const { value: email } = emailRef.current
    const { value: confirmpwd } = confirmpwdRef.current
    const { value: username } = usernameRef.current
    e.preventDefault()
    if (pwd !== confirmpwd) {
      return
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pwd)
      .then(async (userCredential) => {
        userCredential.user
          .updateProfile({
            displayName: username,
          })
          .then((data) => {
            history.push('/login')
            notification(typeNotificaton.success, 'Sign up successfully')
            clearRef()
          })
          .catch((err) => {
            notification(typeNotificaton.error, `Error occurs ${err}`)
          })
      })
      .catch((err) => {
        notification(typeNotificaton.error, `Error occurs ${err}`)
      })
  }
  return (
    <div className='container'>
      <div className='box'>
        <h2 className='title'>SIGN UP</h2>
        <form onSubmit={handleSignup}>
          <div className='form-field'>
            <div className='label'>Username</div>
            <div className='input'>
              <input type='text' ref={usernameRef} />
            </div>
          </div>
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
          <div className='form-field'>
            <div className='label'>Confirm password</div>
            <div className='input'>
              <input type='password' ref={confirmpwdRef} />
            </div>
          </div>
          <div className='btn-section'>
            <input type='submit' value='Sign up' className='btn btn-default' />
          </div>
        </form>
        <div className='text-direct'>
          Already have an account ? <Link to='/login'>Sign in now</Link>
        </div>
      </div>
    </div>
  )
}

export default Signin
