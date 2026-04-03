import type React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from '../../components/utils/Loader'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated === null) {
    return <Loader loading={true} />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
