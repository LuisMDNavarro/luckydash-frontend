import React, { useState } from 'react'
import type { RegisterRequest } from '../../types/auth'
import { Link } from 'react-router-dom'

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
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
        <h2>Let's create your account!</h2>
      </div>

      <div className="input-container">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label className="label">Name</label>
        <div className="underline"></div>
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

      <div className="input-container">
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <label className="label">Confirm Password</label>
        <div className="underline"></div>
      </div>

      <div className="formControl">
        <Link to="/login">
          <button type="button" className="button">
            <span>Login</span>
          </button>
        </Link>
        <button type="submit" className="submitButton">
          <span>Register</span>
        </button>
      </div>
    </form>
  )
}
