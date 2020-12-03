import React, { createContext, useReducer } from 'react'

const roomContext = createContext()

export default roomContext

export const RoomAction = {}

const INITIAL_STATE = {}

function reducer(state, action) {
  switch (action.type) {
    case 'CHOOSE':
      return {
        ...state,
        room: action.payload.data,
      }
    default:
      return state
  }
}

export const RoomProvider = ({ children }) => {
  const [roomState, roomDispatch] = useReducer(reducer, INITIAL_STATE)

  return (
    <roomContext.Provider value={[roomState, roomDispatch]}>
      {children}
    </roomContext.Provider>
  )
}
