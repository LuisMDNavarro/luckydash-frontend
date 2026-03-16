import React, { useState } from 'react'
import type { LoginRequest, LoginResponse } from '../../types/auth'
import { Link } from 'react-router-dom'
import { login } from '../../api/auth'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Loader from '../utils/Loader'

export default function LoginForm() {
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
        <div className="formTittle">
          <h2>¡Bienvenido de nuevo!</h2>
        </div>

        <div className="input-container">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <label className="label">Nombre de Usuario</label>
          <div className="underline"></div>
        </div>

        <div className="input-container">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label className="label">Contraseña</label>
          <div className="underline"></div>
        </div>

        <div className="formControl">
          <button type="submit" className="submitButton">
            <span>Login</span>
          </button>
          <Link to="/register">
            <button type="button" className="button">
              <span>Registro</span>
            </button>
          </Link>
        </div>
      </form>
    </>
  )
}
