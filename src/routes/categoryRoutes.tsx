import { Route } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import CreateCategory from '../pages/finances/CreateCategory'
import CategoriesList from '../pages/finances/ListCategories'
import UpdateCategory from '../pages/finances/UpdateCategory'

export const categoryRoutes = (
  <>
    <Route
      path="/wallet/categories/create"
      element={
        <ProtectedRoute>
          <CreateCategory />
        </ProtectedRoute>
      }
    />
    <Route
      path="/wallet/categories/list"
      element={
        <ProtectedRoute>
          <CategoriesList />
        </ProtectedRoute>
      }
    />
    <Route
      path="/wallet/categories/update/:uid"
      element={
        <ProtectedRoute>
          <UpdateCategory />
        </ProtectedRoute>
      }
    />
  </>
)
