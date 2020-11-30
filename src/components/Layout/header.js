import React from 'react'
import './layout.style.css'
function Header({ username }) {
  return (
    <div className='container-header'>
      <div className='wrapper'>
        <div className='username'>{username}</div>
        <div className='logout'>Log out</div>
      </div>
    </div>
  )
}

export default Header
