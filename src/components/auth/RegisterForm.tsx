import React, { useState } from 'react'
import type { RegisterRequest, RegisterResponse } from '../../types/auth'
import { Link } from 'react-router-dom'
import { register } from '../../api/auth'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Loader from '../utils/Loader'
import { useMutation } from '@tanstack/react-query'

export default function RegisterForm() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    wallet: '',
    password: '',
    confirm_password: '',
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

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success('Tu registro fue exitoso!')
      navigate('/login')
    },
    onError: (error: AxiosError<RegisterResponse>) => {
      if (error.response?.data?.errors) {
        setErrors(error.response?.data?.errors)
      }
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  return (
    <>
      {mutation.isPending && <Loader />}
      <form onSubmit={handleSubmit}>
        <div className="auth-formTittle">
          <h2>¡Vamos a crear tu cuenta!</h2>
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
          {errors.username && <p>{errors.username[0]}</p>}
        </div>

        <div className="auth-input-container">
          <input
            type="text"
            name="wallet"
            value={formData.wallet}
            onChange={handleChange}
            required
          />
          <label className="auth-label">Cartera</label>
          <div className="auth-underline"></div>
        </div>
        <div className="auth-errors">
          {errors.wallet && <p className="auth-errors">{errors.wallet[0]}</p>}
        </div>

        <div className="auth-input-container">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label className="auth-label">Password</label>
          <div className="auth-underline"></div>
        </div>
        <div className="auth-errors">
          {errors.password && (
            <p className="auth-errors">{errors.password[0]}</p>
          )}
        </div>

        <div className="auth-input-container">
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
          <label className="auth-label">Confirmar Contraseña</label>
          <div className="auth-underline"></div>
        </div>
        <div className="auth-errors">
          {errors.confirm_password && (
            <p className="auth-errors">{errors.confirm_password[0]}</p>
          )}
        </div>

        <div className="auth-formControl">
          <Link to="/login">
            <button type="button" className="auth-button">
              <span>Login</span>
            </button>
          </Link>
          <button type="submit" className="auth-submitButton">
            <span>Registro</span>
          </button>
        </div>
      </form>
    </>
  )
}
