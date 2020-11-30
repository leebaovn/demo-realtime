import React from 'react'
import './auth.style.css'
import { Link } from 'react-router-dom'

const handleSignup = (e) => {
  e.preventDefault()
}

function signin() {
  return (
    <div className='container'>
      <div className='box'>
        <h2 className='title'>SIGN UP</h2>
        <form onSubmit={handleSignup}>
          <div className='form-field'>
            <div className='label'>Username</div>
            <div className='input'>
              <input type='text' />
            </div>
          </div>
          <div className='form-field'>
            <div className='label'>Email</div>
            <div className='input'>
              <input type='email' />
            </div>
          </div>
          <div className='form-field'>
            <div className='label'>Password</div>
            <div className='input'>
              <input type='password' />
            </div>
          </div>
          <div className='form-field'>
            <div className='label'>Confirm password</div>
            <div className='input'>
              <input type='password' />
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

export default signin
