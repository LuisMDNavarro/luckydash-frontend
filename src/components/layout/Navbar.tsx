import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../../api/auth'
import Loader from '../utils/Loader'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { setIsAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  type Paths = '/main' | '/users' | '/wallet'
  const isActive = (path: Paths) => location.pathname.startsWith(path)
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)

    try {
      await logout()
      setIsAuthenticated(false)
      toast.success('Hasta pronto!')
      navigate('/login')
    } catch (error) {
      toast.error('Error al cerrar la sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Loader loading={loading} />
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
