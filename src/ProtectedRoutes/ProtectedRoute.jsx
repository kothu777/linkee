import React, { useContext } from 'react'
import { AuthContext } from '../contexts/authContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({children}) {
  const {isLoggedIn} = useContext(AuthContext);
  return (
    <div>
        {isLoggedIn ? children : <Navigate to="/login" />}
    </div>
  )
}
