import { Route } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import CreateTransaction from '../pages/finances/CreateTransaction'
import UpdateTransaction from '../pages/finances/UpdateTransaction'
import TransactionsList from '../pages/finances/ListTransactions'

export const transactionRoutes = (
  <>
    <Route
      path="/wallet/transactions/list"
      element={
        <ProtectedRoute>
          <TransactionsList />
        </ProtectedRoute>
      }
    />
    <Route
      path="/wallet/transactions/create"
      element={
        <ProtectedRoute>
          <CreateTransaction />
        </ProtectedRoute>
      }
    />
    <Route
      path="/wallet/transactions/update/:uid"
      element={
        <ProtectedRoute>
          <UpdateTransaction />
        </ProtectedRoute>
      }
    />
  </>
)
