import { Navigate } from 'react-router-dom'
import Loader from '../../components/utils/Loader'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../../api/user'
import type { User } from '../../types/user'
import { AxiosError } from 'axios'

export default function RootRedirect() {
  const { isLoading, isError } = useQuery<User, AxiosError<User>>({
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

  return <Navigate to="/main" replace />
}
