import React, { useState } from 'react'
import type { LoginRequest, LoginResponse } from '../../types/auth'
import { Link } from 'react-router-dom'
import { login } from '../../api/auth'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Loader from '../utils/Loader'
import { useAuth } from '../../context/AuthContext'

export default function LoginForm() {
  const { setIsAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(formData)
      setIsAuthenticated(true)
      toast.success('Bienvenido!')
      navigate('/main')
    } catch (error) {
      const e = error as AxiosError<LoginResponse>
      if (e.response?.data?.detail) {
        toast.error('Usuario o contraseña incorrectos')
        return
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Loader loading={loading} />
      <form onSubmit={handleSubmit}>
        <div className="auth-formTittle">
          <h2>¡Bienvenido de nuevo!</h2>
        </div>

        <div className="auth-input-container">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <label className="auth-label">Nombre de Usuario</label>
          <div className="auth-underline"></div>
        </div>

        <div className="auth-input-container">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label className="auth-label">Contraseña</label>
          <div className="auth-underline"></div>
        </div>

        <div className="auth-formControl">
          <button type="submit" className="auth-submitButton">
            <span>Login</span>
          </button>
          <Link to="/register">
            <button type="button" className="auth-button">
              <span>Registro</span>
            </button>
          </Link>
        </div>
      </form>
    </>
  )
}
