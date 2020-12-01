import React, { useEffect, useState } from 'react'
import './layout.style.css'
import firebase, { auth } from './../../firebase'

function Header() {
  const [username, setUsername] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setPhotoUrl(user.photoURL)
        setUsername(user.displayName)
      } else {
        console.log('not user')
      }
    })
  }, [])

  const logout = () => {
    firebase.auth().signOut()
    localStorage.removeItem('@token')
  }
  return (
    <div className='container-header'>
      <div className='wrapper'>
        <div className='username'>{username}</div>
        <div className='logout' onClick={logout}>
          Log out
        </div>
      </div>
    </div>
  )
}

export default Header
