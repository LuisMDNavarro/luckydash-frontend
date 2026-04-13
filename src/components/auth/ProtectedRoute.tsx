import type React from 'react'
import { Navigate } from 'react-router-dom'
import Loader from '../../components/utils/Loader'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../../api/user'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    retry: false,
  })

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
