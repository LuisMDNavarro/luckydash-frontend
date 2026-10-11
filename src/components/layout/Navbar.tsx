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
    sessionStorage.clear()
  }

  return (
    <>
      {mutation.isPending && <Loader />}
      <div className="navbar-container">
        <div className="navbar">
          <Link className="btn" to="/main">
            <div className={`btn ${isActive('/main') ? 'active' : ''}`}>
              <span className="prime--home"></span>
            </div>
          </Link>
          <Link className="btn" to="/wallet/accounts/list">
            <div className={`btn ${isActive('/wallet') ? 'active' : ''}`}>
              <span className="fluent--wallet-credit-card-20-regular"></span>
            </div>
          </Link>
          <Link className="btn" to="/users/profile/view">
            <div className={`btn ${isActive('/users') ? 'active' : ''}`}>
              <span className="iconoir--profile-circle"></span>
            </div>
          </Link>
          <button className="btn logout-btn" onClick={handleLogout}>
            <div className="btn">
              <span className="material-symbols--logout-rounded"></span>
            </div>
          </button>
          <a
            className="btn"
            href="https://luismdnavarro.github.io/my_first_game/"
            target="_blank"
          >
            <div className="btn">
              <span className="codicon--game"></span>
            </div>
          </a>
          <svg
            className="outline"
            overflow="visible"
            viewBox="0 0 400 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              className="rect"
              pathLength="100"
              x="0"
              y="0"
              fill="transparent"
            ></rect>
          </svg>
        </div>
      </div>
    </>
  )
}
