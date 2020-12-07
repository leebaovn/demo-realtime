import React from 'react'
import Header from './header'
function MainLayout({ children }) {
  return (
    <div className='layout'>
      <Header />
      <div className='content'>{children}</div>
    </div>
  )
}

export default MainLayout
