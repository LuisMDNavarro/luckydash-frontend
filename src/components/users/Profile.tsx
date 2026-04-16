import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateProfile } from '../../api/user'
import Loader from '../utils/Loader'
import { toast } from 'react-toastify'
import Error from '../utils/Error'
import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'

export default function Profile() {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })
  useEffect(() => {
    if (isError) {
      toast.error('Error al cargar el Perfil')
    }
  }, [isError])

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      })
    }
  }, [user])

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

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Perfil actualizado')
    },
    onError: (error: AxiosError<Record<string, string[]>>) => {
      toast.error('Actualización de Perfil fallida')
      if (error.response?.data) {
        setErrors(error.response.data)
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string[]> = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (formData.username.length == 0) {
      newErrors.username = ['Este campo no puede estar vacio']
    }

    if (formData.username.length > 50) {
      newErrors.username = ['Máximo 50 caracteres permitidos']
    }

    if (formData.email.length > 150) {
      newErrors.email = ['Máximo 150 caracteres permitidos']
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = ['Correo inválido']
    }

    if (formData.first_name.length > 75) {
      newErrors.first_name = ['Máximo 75 caracteres permitidos']
    }

    if (formData.last_name.length > 100) {
      newErrors.last_name = ['Máximo 100 caracteres permitidos']
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    mutation.mutate(formData)
  }

  if (isLoading) return <Loader />
  if (isError)
    return <Error message="No se pudo obtener la información del Perfil" />

  return (
    <>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-tittle">
            <h2>Perfil</h2>
          </div>
          <span className="form-input-span">
            <label className="form-label">ID Usuario</label>
            <input type="text" value={user?.uid} disabled></input>
          </span>
          <span className="form-input-span">
            <label className="form-label">Nombre de Usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              maxLength={50}
              required
            />
          </span>
          <div className="form-errors">
            {errors.username && <p>{errors.username[0]}</p>}
          </div>
          <span className="form-input-span">
            <label className="form-label">Correo</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              maxLength={150}
            />
          </span>
          <div className="form-errors">
            {errors.email && <p>{errors.email[0]}</p>}
          </div>
          <span className="form-input-span">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              maxLength={75}
            />
          </span>
          <div className="form-errors">
            {errors.first_name && <p>{errors.first_name[0]}</p>}
          </div>
          <span className="form-input-span">
            <label className="form-label">Apellidos</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              maxLength={100}
            />
          </span>
          <div className="form-errors">
            {errors.last_name && <p>{errors.last_name[0]}</p>}
          </div>
          <div className="form-control">
            <button
              type="submit"
              className="form-submitButton"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <span className="codex--loader"></span>
              ) : (
                <span>Actualizar</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
