import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import './index.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App
