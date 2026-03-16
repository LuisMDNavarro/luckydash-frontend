import { Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Main from './pages/Main'
import './styles/index.css'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<Main />} />
      </Routes>
      <ToastContainer theme="colored" />
    </>
  )
}

export default App
