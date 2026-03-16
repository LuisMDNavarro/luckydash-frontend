import React, { useState } from 'react'
import type { RegisterRequest, RegisterResponse } from '../../types/auth'
import { Link } from 'react-router-dom'
import { register } from '../../api/auth'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Loader from '../utils/Loader'

export default function RegisterForm() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await register(formData)
      toast.success('Tu registro fue exitoso!')
      navigate('/login')
    } catch (error) {
      const e = error as AxiosError<RegisterResponse>
      if (e.response?.data?.errors) {
        setErrors(e.response?.data?.errors)
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
          <h2>¡Vamos a crear tu cuenta!</h2>
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
        <div className="errors">
          {errors.username && <p>{errors.username[0]}</p>}
        </div>

        <div className="input-container">
          <input
            type="text"
            name="wallet"
            value={formData.wallet}
            onChange={handleChange}
            required
          />
          <label className="label">Cartera</label>
          <div className="underline"></div>
        </div>
        <div className="errors">
          {errors.wallet && <p className="errors">{errors.wallet[0]}</p>}
        </div>

        <div className="input-container">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label className="label">Password</label>
          <div className="underline"></div>
        </div>
        <div className="errors">
          {errors.password && <p className="errors">{errors.password[0]}</p>}
        </div>

        <div className="input-container">
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
          <label className="label">Confirmar Contraseña</label>
          <div className="underline"></div>
        </div>
        <div className="errors">
          {errors.confirm_password && (
            <p className="errors">{errors.confirm_password[0]}</p>
          )}
        </div>

        <div className="formControl">
          <Link to="/login">
            <button type="button" className="button">
              <span>Login</span>
            </button>
          </Link>
          <button type="submit" className="submitButton">
            <span>Registro</span>
          </button>
        </div>
      </form>
    </>
  )
}
