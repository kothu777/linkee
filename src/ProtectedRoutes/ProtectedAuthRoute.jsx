import React, { useContext } from 'react'
import { AuthContext } from '../contexts/authContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedAuthRoute({children}) {
    const {isLoggedIn} = useContext(AuthContext);
  return (
    <div>
        {isLoggedIn ? <Navigate to="/" /> : children}
    </div>
  )
}
