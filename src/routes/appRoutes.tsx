import { Route } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import RootRedirect from '../components/auth/RootRedirect'
import Main from '../pages/MainDashboard'

export const appRoutes = (
  <>
    <Route path="/" element={<RootRedirect />} />
    <Route
      path="/main"
      element={
        <ProtectedRoute>
          <Main />
        </ProtectedRoute>
      }
    />
  </>
)
