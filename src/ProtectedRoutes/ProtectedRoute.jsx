import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({children}) {
    const isLoggedIn = localStorage.getItem("token");
  return (
    <div>
        {isLoggedIn ? children : <Navigate to="/login" />}
    </div>
  )
}
