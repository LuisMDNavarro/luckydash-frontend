import React, { useState } from 'react'
import type { LoginRequest } from '../../types/auth'
import { Link } from 'react-router-dom'

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
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
        <h2>Welcome back!</h2>
      </div>

      <div className="input-container">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label className="label">Email</label>
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

      <div className="formControl">
        <button type="submit" className="submitButton">
          <span>Login</span>
        </button>
        <Link to="/register">
          <button type="button" className="button">
            <span>Register</span>
          </button>
        </Link>
      </div>
    </form>
  )
}
