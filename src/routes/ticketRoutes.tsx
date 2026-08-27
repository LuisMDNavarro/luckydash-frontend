import { Route } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import CreateTicket from '../pages/finances/CreateTicket'
import UpdateTicket from '../pages/finances/UpdateTicket'
import TicketsList from '../pages/finances/ListTickets'

export const ticketRoutes = (
  <>
    <Route
      path="/wallet/tickets/list"
      element={
        <ProtectedRoute>
          <TicketsList />
        </ProtectedRoute>
      }
    />
    <Route
      path="/wallet/tickets/create"
      element={
        <ProtectedRoute>
          <CreateTicket />
        </ProtectedRoute>
      }
    />
    <Route
      path="/wallet/tickets/update/:uid"
      element={
        <ProtectedRoute>
          <UpdateTicket />
        </ProtectedRoute>
      }
    />
  </>
)
