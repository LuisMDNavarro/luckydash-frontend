import React, { useState } from 'react'
import type { Category } from '../../types/finance'
import { CATEGORY_TYPES, EXPENSE_TYPE } from '../../types/finance'
import { useEffect } from 'react'

type CategoryFormProps = {
  initialData?: Partial<Category>
  onSubmit: (data: Category) => void
  isLoading?: boolean
  submitLabel?: string
  backendErrors?: Record<string, string[]>
}

export default function CategoryForm({
  initialData,
  onSubmit,
  isLoading,
  submitLabel = 'Crear',
  backendErrors,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<Category>({
    name: initialData?.name || '',
    color: initialData?.color || '',
    type: initialData?.type || EXPENSE_TYPE,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? '',
        color: initialData.color ?? '',
        type: initialData.type ?? EXPENSE_TYPE,
      })
    }
  }, [initialData])

  const [errors, setErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (backendErrors) {
      setErrors(backendErrors)
    }
  }, [backendErrors])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string[]> = {}
    const hexRegex = /^#[0-9A-Fa-f]{6}$/
    const validValues = CATEGORY_TYPES.map((o) => o.value)

    if (formData.name.length == 0) {
      newErrors.name = ['Este campo no puede estar vacio']
    }

    if (formData.name.length > 255) {
      newErrors.name = ['Máximo 255 caracteres permitidos']
    }

    if (formData.color.length == 0) {
      newErrors.color = ['Este campo no puede estar vacio']
    }

    if (formData.color.length > 0 && !hexRegex.test(formData.color)) {
      newErrors.color = ['El color no es valido']
    }

    if (!validValues.includes(formData.type)) {
      newErrors.type = ['Tipo inválido']
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  return (
    <>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-title">
            <h2>Categoria</h2>
          </div>
          <span className="form-input-span">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={255}
              required
            />
          </span>
          <div className="form-errors">
            {errors.name && <p>{errors.name[0]}</p>}
          </div>
          <span className="form-input-span">
            <label className="form-label">Color</label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </span>
          <div className="form-errors">
            {errors.color && <p>{errors.color[0]}</p>}
          </div>
          <span className="form-input-span">
            <label className="form-label">Tipo</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              {CATEGORY_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
          <div className="form-errors">
            {errors.type && <p>{errors.type[0]}</p>}
          </div>
          <div className="form-control">
            <button
              type="submit"
              className="form-submitButton"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="codex--loader"></span>
              ) : (
                <span>{submitLabel}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
