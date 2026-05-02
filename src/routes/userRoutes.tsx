import { Route } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import ViewProfile from '../pages/users/Profile'

export const userRoutes = (
  <>
    <Route
      path="/users/profile/view"
      element={
        <ProtectedRoute>
          <ViewProfile />
        </ProtectedRoute>
      }
    />
  </>
)
