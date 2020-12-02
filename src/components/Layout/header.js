import React, { useEffect, useState } from 'react'
import './layout.style.css'
import firebase, { auth } from './../../firebase'
import { Link, useHistory } from 'react-router-dom'
function Header() {
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setPhotoUrl(user.photoURL)
        setUsername(user.displayName)
      } else {
        history.push('/login')
      }
    })
  }, [])

  const logout = () => {
    firebase.auth().signOut()
  }
  return (
    <div className='container-header'>
      <div className='wrapper'>
        <div className='username'>
          <img src={photoUrl} className='avatar' /> {username}
        </div>
        <div className='logout' onClick={logout}>
          Log out
        </div>
      </div>
    </div>
  )
}

export default Header
