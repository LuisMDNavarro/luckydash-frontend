import { Link, useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../../api/auth'
import Loader from '../utils/Loader'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { LogoutResponse } from '../../types/auth'
import { AxiosError } from 'axios'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  type Paths = '/main' | '/users' | '/wallet'
  const isActive = (path: Paths) => location.pathname.startsWith(path)

  const queryClient = useQueryClient()
  const mutation = useMutation<
    LogoutResponse,
    AxiosError<LogoutResponse>,
    void
  >({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
      toast.success('Hasta pronto!')
      navigate('/login')
    },
    onError: (error) => {
      if (error.response?.data?.detail) {
        toast.error('Error al cerrar la sesión')
      }
    },
  })

  const handleLogout = async () => {
    mutation.mutate()
  }

  return (
    <>
      {mutation.isPending && <Loader />}
      <div className="navbar-container">
        <div className="navbar">
          <div className={`btn ${isActive('/main') ? 'active' : ''}`}>
            <Link to="/main">
              <span className="prime--home"></span>
            </Link>
          </div>
          <div className={`btn ${isActive('/wallet') ? 'active' : ''}`}>
            <Link to="/wallet/accounts/list">
              <span className="fluent--wallet-credit-card-20-regular"></span>
            </Link>
          </div>
          <div className={`btn ${isActive('/users') ? 'active' : ''}`}>
            <Link to="/users/profile/view">
              <span className="iconoir--profile-circle"></span>
            </Link>
          </div>
          <div className="btn">
            <button className="logout-btn" onClick={handleLogout}>
              <span className="material-symbols--logout-rounded"></span>
            </button>
          </div>
          <svg
            className="outline"
            overflow="visible"
            width="400"
            height="60"
            viewBox="0 0 400 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              className="rect"
              pathLength="100"
              x="0"
              y="0"
              width="400"
              height="60"
              fill="transparent"
              strokeWidth="5"
            ></rect>
          </svg>
        </div>
      </div>
    </>
  )
}
