import './App.css'
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Login from './components/Auth/login'
import Signup from './components/Auth/signin'
import Room from './pages/Room'
import RoomDetail from './pages/Room/room-detail'
import Layout from './components/Layout'
import Guest from './pages/Guest'
import GuestLogin from './components/Auth/guest_login'

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/roomplay/:roomId/login'>
          <GuestLogin />
        </Route>
        <Route path='/roomplay/:roomId'>
          <Guest />
        </Route>
        <Route path='/login'>
          <Login />
        </Route>
        <Route path='/signup'>
          <Signup />
        </Route>
        <Route path='/:id'>
          <Layout>
            <RoomDetail />
          </Layout>
        </Route>
        <Route path='/'>
          <Layout>
            <Room />
          </Layout>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
