import React, { useEffect, useState } from 'react'
import './layout.style.css'
import firebase, { auth } from './../../firebase'
import { LogoutOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import { Button } from 'antd'
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
          {photoUrl && <img src={photoUrl} className='avatar' />} {username}
        </div>
        <div className='logout' onClick={logout}>
          <Button
            style={{ color: 'red', textTransform: 'uppercase' }}
            type='dashed'
            danger
          >
            ログアウト
            <LogoutOutlined style={{ marginLeft: '0.5rem' }} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Header
