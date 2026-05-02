import { Route } from 'react-router-dom'
import PublicRoute from '../components/auth/PublicRoute'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

export const authRoutes = (
  <>
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
  </>
)
