import React, { useState } from 'react'
import type { LoginRequest, LoginResponse } from '../../types/auth'
import { Link } from 'react-router-dom'
import { login } from '../../api/auth'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Loader from '../utils/Loader'
import { useMutation } from '@tanstack/react-query'

export default function LoginForm() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  })

  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }

  const mutation = useMutation<
    LoginResponse,
    AxiosError<LoginResponse>,
    LoginRequest
  >({
    mutationFn: login,
    onSuccess: () => {
      toast.success('Bienvenido!')
      navigate('/main')
    },
    onError: (error) => {
      if (error.response?.data?.detail) {
        toast.error('Usuario o contraseña incorrectos')
      }
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string[]> = {}

    if (formData.username.length == 0) {
      newErrors.username = ['Este campo no puede estar vacio']
    }

    if (formData.password.length == 0) {
      newErrors.password = ['Este campo no puede estar vacio']
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    mutation.mutate(formData)
  }

  return (
    <>
      {mutation.isPending && <Loader />}
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
        <div className="auth-errors">
          {errors.username && <p>{errors.username}</p>}
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
        <div className="auth-errors">
          {errors.password && <p>{errors.password}</p>}
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
