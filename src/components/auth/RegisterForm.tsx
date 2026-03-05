import React, { useState } from 'react'
import type { RegisterRequest } from '../../types/auth'
import { Link } from 'react-router-dom'

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    wallet: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log('Registro enviado', formData)

    //Aqui se llama la API
  }

  return (
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

      <div className="input-container">
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <label className="label">Confirmar Contraseña</label>
        <div className="underline"></div>
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
  )
}
