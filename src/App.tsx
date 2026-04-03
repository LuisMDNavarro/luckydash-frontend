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
      </Routes>
      <ToastContainer theme="colored" />
    </>
  )
}

export default App
