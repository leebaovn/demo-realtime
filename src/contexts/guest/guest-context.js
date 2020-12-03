import React, { createContext, useReducer } from 'react'

const guestContext = createContext()

export default guestContext

export const GuestAction = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
}

const INITIAL_STATE = {
  displayName: window.localStorage.getItem('displayName') || '',
  guestId: window.localStorage.getItem('guestId') || '',
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      if (action.payload.displayName) {
        window.localStorage.setItem('displayName', action.payload.displayName)
        window.localStorage.setItem('guestId', action.payload.guestId)
      }
      return {
        ...state,
        displayName: action.payload.displayName,
        guestId: action.payload.guestId,
      }

    case 'LOGOUT':
      window.localStorage.removeItem('displayName')
      window.localStorage.removeItem('guestId')
      return {
        ...INITIAL_STATE,
        displayName: '',
        guestId: '',
      }
    default:
      return state
  }
}

export const GuestProvider = ({ children }) => {
  const [guestState, guestDispatch] = useReducer(reducer, INITIAL_STATE)

  return (
    <guestContext.Provider value={[guestState, guestDispatch]}>
      {children}
    </guestContext.Provider>
  )
}
