import React, { useState } from 'react'
import type { LoginRequest } from '../../types/auth'
import { Link } from 'react-router-dom'

export default function LoginForm() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log('Login enviado:', formData)

    //Aqui se llama la API
  }

  return (
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
  )
}
