import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Main from './pages/MainDashboard'
import './styles/index.css'
import { ToastContainer } from 'react-toastify'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import { useAuth } from './context/AuthContext'
import Loader from './components/utils/Loader'
import AccountsList from './pages/finances/Accounts'
import ViewProfile from './pages/users/Profile'

function App() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated === null) {
    return <Loader loading={true} />
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? '/main' : '/login'}
              replace
            ></Navigate>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet/accounts/list"
          element={
            <ProtectedRoute>
              <AccountsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/profile/view"
          element={
            <ProtectedRoute>
              <ViewProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer theme="colored" />
    </>
  )
}

export default App
