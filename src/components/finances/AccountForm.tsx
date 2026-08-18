import React, { useState } from 'react'
import type { Account } from '../../types/finance'
import {
  CASH_TYPE,
  DEBIT_TYPE,
  CREDIT_TYPE,
  ACCOUNT_TYPES,
} from '../../types/finance'
import { useEffect } from 'react'

type AccountFormProps = {
  initialData?: Partial<Account>
  onSubmit: (data: Account) => void
  isLoading?: boolean
  submitLabel?: string
  backendErrors?: Record<string, string[]>
}

export default function AccountForm({
  initialData,
  onSubmit,
  isLoading,
  submitLabel = 'Crear',
  backendErrors,
}: AccountFormProps) {
  const [formData, setFormData] = useState<Account>({
    name: initialData?.name || '',
    color: initialData?.color || '',
    type: initialData?.type || CASH_TYPE,
    savings: initialData?.savings || '0.00',
    amount: initialData?.amount || '0.00',
    credit_limit: initialData?.credit_limit || '0.00',
    billing_date: initialData?.billing_date || 1,
    payment_deadline: initialData?.payment_deadline || 1,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? '',
        color: initialData.color ?? '',
        type: initialData.type ?? CASH_TYPE,
        savings: initialData.savings ?? '0.00',
        amount: initialData.amount ?? '0.00',
        credit_limit: initialData.credit_limit ?? '0.00',
        billing_date: initialData.billing_date ?? 1,
        payment_deadline: initialData.payment_deadline ?? 1,
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

  const handleDecimalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const decimalRegex = /^\d*\.?\d{0,2}$/
    if (decimalRegex.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (!value) return

    const number = parseFloat(value)

    if (!isNaN(number)) {
      setFormData((prev) => ({
        ...prev,
        [name]: number.toFixed(2),
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string[]> = {}
    const hexRegex = /^#[0-9A-Fa-f]{6}$/
    const validValues = ACCOUNT_TYPES.map((o) => o.value)
    const decimalRegex = /^\d+(\.\d{2})$/

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

    if (formData.type === CASH_TYPE || formData.type === DEBIT_TYPE) {
      if (formData.savings.length > 13) {
        newErrors.savings = ['Máximo 12 digitos permitidos']
      }
      if (formData.savings.length == 0) {
        newErrors.savings = ['Este campo no puede estar vacio']
      }
      if (formData.savings.length > 0 && !decimalRegex.test(formData.savings)) {
        newErrors.savings = ['Debe ser un número con 2 decimales']
      }
      if (formData.amount.length > 13) {
        newErrors.amount = ['Máximo 12 digitos permitidos']
      }
      if (formData.amount.length == 0) {
        newErrors.amount = ['Este campo no puede estar vacio']
      }
      if (formData.amount.length > 0 && !decimalRegex.test(formData.amount)) {
        newErrors.amount = ['Debe ser un número con 2 decimales']
      }
    }
    if (formData.type === CREDIT_TYPE) {
      if (formData.credit_limit.length > 13) {
        newErrors.credit_limit = ['Máximo 12 digitos permitidos']
      }
      if (formData.credit_limit.length == 0) {
        newErrors.credit_limit = ['Este campo no puede estar vacio']
      }
      if (
        formData.credit_limit.length > 0 &&
        !decimalRegex.test(formData.credit_limit)
      ) {
        newErrors.credit_limit = ['Debe ser un número con 2 decimales']
      }
      const billing_date = Number(formData.billing_date)
      if (
        !Number.isInteger(billing_date) ||
        formData.billing_date <= 0 ||
        formData.billing_date > 31
      ) {
        newErrors.billing_date = ['Debe ser un número entre 1 y 31']
      }
      const payment_deadline = Number(formData.payment_deadline)
      if (
        !Number.isInteger(payment_deadline) ||
        formData.payment_deadline <= 0 ||
        formData.payment_deadline > 31
      ) {
        newErrors.payment_deadline = ['Debe ser un número entre 1 y 31']
      }
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
            <h2>Cuenta</h2>
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
            {errors.name && <p>{errors.name}</p>}
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
            {errors.color && <p>{errors.color}</p>}
          </div>
          <span className="form-input-span">
            <label className="form-label">Tipo</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              {ACCOUNT_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
          <div className="form-errors">
            {errors.type && <p>{errors.type}</p>}
          </div>
          {(formData.type === CASH_TYPE || formData.type == DEBIT_TYPE) && (
            <>
              <span className="form-input-span">
                <label className="form-label">Ahorros</label>
                <input
                  type="text"
                  name="savings"
                  value={formData.savings}
                  onChange={handleDecimalChange}
                  onBlur={handleBlur}
                />
              </span>
              <div className="form-errors">
                {errors.savings && <p>{errors.savings}</p>}
              </div>
              <span className="form-input-span">
                <label className="form-label">Monto</label>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleDecimalChange}
                  onBlur={handleBlur}
                />
              </span>
              <div className="form-errors">
                {errors.amount && <p>{errors.amount}</p>}
              </div>
            </>
          )}
          {formData.type === CREDIT_TYPE && (
            <>
              <span className="form-input-span">
                <label className="form-label">Limite de Credito</label>
                <input
                  type="text"
                  name="credit_limit"
                  value={formData.credit_limit}
                  onChange={handleDecimalChange}
                  onBlur={handleBlur}
                />
              </span>
              <div className="form-errors">
                {errors.credit_limit && <p>{errors.credit_limit}</p>}
              </div>
              <span className="form-input-span">
                <label className="form-label">Día de corte</label>
                <input
                  type="number"
                  name="billing_date"
                  value={formData.billing_date}
                  onChange={handleChange}
                  min={1}
                  max={31}
                />
              </span>
              <div className="form-errors">
                {errors.billing_date && <p>{errors.billing_date}</p>}
              </div>
              <span className="form-input-span">
                <label className="form-label">Día límite de pago</label>
                <input
                  type="number"
                  name="payment_deadline"
                  value={formData.payment_deadline}
                  onChange={handleChange}
                  min={1}
                  max={31}
                />
              </span>
              <div className="form-errors">
                {errors.payment_deadline && <p>{errors.payment_deadline}</p>}
              </div>
            </>
          )}
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
