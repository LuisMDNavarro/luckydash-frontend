import { Route } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import AccountsList from '../pages/finances/ListAccounts'
import CreateAccount from '../pages/finances/CreateAccount'
import UpdateAccount from '../pages/finances/UpdateAccount'

export const accountRoutes = (
  <>
    <Route
      path="/wallet/accounts/list"
      element={
        <ProtectedRoute>
          <AccountsList />
        </ProtectedRoute>
      }
    />
    <Route
      path="/wallet/accounts/create"
      element={
        <ProtectedRoute>
          <CreateAccount />
        </ProtectedRoute>
      }
    />
    <Route
      path="/wallet/accounts/update/:uid"
      element={
        <ProtectedRoute>
          <UpdateAccount />
        </ProtectedRoute>
      }
    />
  </>
)
