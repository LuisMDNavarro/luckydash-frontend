import { Routes } from 'react-router-dom'
import './styles/index.css'
import { ToastContainer } from 'react-toastify'
import { appRoutes } from './routes/appRoutes'
import { authRoutes } from './routes/authRoutes'
import { userRoutes } from './routes/userRoutes'
import { accountRoutes } from './routes/accountRoutes'

function App() {
  return (
    <>
      <Routes>
        {appRoutes}
        {authRoutes}
        {accountRoutes}
        {userRoutes}
      </Routes>
      <ToastContainer theme="colored" />
    </>
  )
}

export default App
