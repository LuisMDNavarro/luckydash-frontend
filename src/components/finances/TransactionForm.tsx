import React, { useState } from 'react'
import type { Transaction } from '../../types/finance'
import { TRANSACTIONS_TYPES, EXPENSE_TYPE, TRANSFER_TYPE, INSTALLMENTS_TRANSACTION_TYPE } from '../../types/finance'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type { GetAccountsResponse, GetCategoriesResponse } from '../../types/finance'
import { getAccounts, getCategories } from '../../api/finance'
import type { AxiosError } from 'axios'
import { getToday } from '../utils/date'

type TransactionFormProps = {
  initialData?: Partial<Transaction>
  onSubmit: (data: Transaction) => void
  isLoading?: boolean
  submitLabel?: string
  backendErrors?: Record<string, string[]>
}

export default function TransactionForm({
  initialData,
  onSubmit,
  isLoading,
  submitLabel = 'Crear',
  backendErrors,
}: TransactionFormProps) {

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    isError: isErrorAccounts,
  } = useQuery<GetAccountsResponse, AxiosError<{ detail: string }>>({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  })
  useEffect(() => {
    if (isErrorAccounts) {
      toast.error('Error al cargar las Cuentas')
    }
  }, [isErrorAccounts])

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery<GetCategoriesResponse, AxiosError<{ detail: string }>>({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
  useEffect(() => {
    if (isErrorCategories) {
      toast.error('Error al cargar las Categorias')
    }
  }, [isErrorCategories])


  const [formData, setFormData] = useState<Transaction>({
    ticket: initialData?.ticket || '',
    from_account: initialData?.from_account || accounts?.[0]?.uid || '',
    category: initialData?.category || categories?.[0]?.uid || '',
    type: initialData?.type || EXPENSE_TYPE,
    amount: initialData?.amount || '0.00',
    description: initialData?.description || '',
    purchase_date: initialData?.purchase_date || getToday(),
    to_account: initialData?.to_account || accounts?.[0]?.uid || '',
    installments: initialData?.installments || '',
    installment_number: initialData?.installment_number || '',
    parent_transaction: initialData?.parent_transaction || '',
    approval_date: initialData?.approval_date || '',
    is_monthly: initialData?.is_monthly || false,
  })

  const availableCategories =
  categories?.filter(
    (category) =>
      formData.type === TRANSFER_TYPE ||
      formData.type.includes(category.type)
  ) ?? []

  useEffect(() => {
    if (initialData) {
      const account_uid = initialData.from_account?.split('-[')[0]
      const category_uid = initialData.category?.split('-[')[0]
      const to_account_uid = initialData.to_account?.split('-[')[0]
      setFormData({
        ticket: initialData.ticket ?? '',
        from_account: account_uid ?? accounts?.[0]?.uid ?? '',
        category: category_uid ?? categories?.[0]?.uid ?? '',
        type: initialData.type ?? EXPENSE_TYPE,
        amount: initialData.amount ?? '0.00',
        description: initialData.description ?? '',
        purchase_date: initialData.purchase_date ?? new Date().toISOString().split('T')[0],
        to_account: to_account_uid ?? accounts?.[0]?.uid ?? '',
        installments: initialData.installments ?? '',
        installment_number: initialData.installment_number ?? '',
        parent_transaction: initialData?.parent_transaction || '',
        approval_date: initialData.approval_date ?? '',
        is_monthly: initialData.is_monthly ?? false,
      })
    }
  }, [initialData])

  useEffect(() => {
  if (!availableCategories.length) return

  const exists = availableCategories.some(
    (category) => category.uid === formData.category
  )

  if (!exists) {
    setFormData((prev) => ({
      ...prev,
      category: availableCategories[0].uid ?? ''
    }))
  }
}, [formData.type, categories])

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

    const fieldValue =
    e.target instanceof HTMLInputElement &&
    e.target.type === 'checkbox'
      ? e.target.checked
      : value

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
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
    const validValues = TRANSACTIONS_TYPES.map((o) => o.value)
    const validAccounts = accounts?.map((o) => o.uid)
    const validCategories = categories?.map((o) => o.uid)
    const decimalRegex = /^\d+(\.\d{2})$/
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

    if (!validAccounts?.includes(formData.from_account)) {
      newErrors.from_account = ['Cuenta inválida']
    }

    if (!validCategories?.includes(formData.category)) {
      newErrors.category = ['Categoria inválida']
    }

    if (!validValues.includes(formData.type)) {
      newErrors.type = ['Tipo inválido']
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

    if (formData.description.length == 0) {
      newErrors.description = ['Este campo no puede estar vacio']
    }

    if (formData.description.length > 255) {
      newErrors.description = ['Máximo 255 caracteres permitidos']
    }

    if (formData.purchase_date.length > 0 && !dateRegex.test(formData.purchase_date)) {
      newErrors.purchase_date = ["La fecha no es valida"]
    }
    if (formData.type === TRANSFER_TYPE) {
      if (!validAccounts?.includes(formData.to_account)) {
        newErrors.to_account = ['Cuenta inválida']
      }

      if (formData.from_account === formData.to_account) {
        newErrors.to_account = ['La cuenta destino debe ser diferente a la origen']
      }
    }

    if (formData.type === INSTALLMENTS_TRANSACTION_TYPE){
      if (formData.installments &&(formData.installments < 2 || formData.installments > 12)){
        newErrors.installments = ['Debe ser mayor o igual que 2 y menor o igual que 12 ']
      }
    }

    if (formData.approval_date && formData.approval_date.length > 0 && !dateRegex.test(formData.approval_date)) {
      newErrors.approval_date = ["La fecha no es valida"]
    }

    if (formData.ticket === '') {
      delete formData.ticket
    }

    if (formData.to_account === '') {
      delete formData.to_account
    }

    if (formData.installments === '') {
      delete formData.installments
    }

    if (formData.installment_number === '') {
      delete formData.installment_number
    }

    if (formData.parent_transaction === '') {
      delete formData.parent_transaction
    }

    if (formData.approval_date === '') {
      delete formData.approval_date
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
            <h2>Transaccion</h2>
          </div>
          {(formData.ticket) && (
            <span className="form-input-span">
              <label className="form-label">Ticket</label>
              <input
                value={formData.ticket}
                readOnly
              />
            </span>
          )}
          <span className="form-input-span">
                <label className="form-label">Cuenta origen</label>
                <select name="from_account" value={formData.from_account} onChange={handleChange} disabled={isLoadingAccounts}>
                  {accounts?.map((account, index) => (
                    <option  key={index} value={account.uid}>{account.name}</option>
                  ))}
                </select>
              </span>
              <div className="form-errors">
                {errors.from_account && <p>{errors.from_account}</p>}
              </div>
          <span className="form-input-span">
            <label className="form-label">Tipo</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              {TRANSACTIONS_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
          <div className="form-errors">
            {errors.type && <p>{errors.type}</p>}
          </div>
          <span className="form-input-span">
            <label className="form-label">Categoria</label>
            <select name="category" value={formData.category} onChange={handleChange} disabled={isLoadingCategories}>
              {availableCategories.map((category, index) =>(
                    <option  key={index} value={category.uid}>{category.name}</option>
                  ))}
            </select>
          </span>
          <div className="form-errors">
            {errors.category && <p>{errors.category}</p>}
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
          <span className="form-input-span">
            <label className="form-label">Descripcion</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
                />
          </span>
          <div className="form-errors">
            {errors.description && <p>{errors.description}</p>}
          </div>
          <span className="form-input-span">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleChange}
                />
          </span>
          <div className="form-errors">
            {errors.purchase_date && <p>{errors.purchase_date}</p>}
          </div>
          {(formData.type === TRANSFER_TYPE ) && (
            <>
              <span className="form-input-span">
                <label className="form-label">Cuenta destino</label>
                <select name="to_account" value={formData.to_account} onChange={handleChange} disabled={isLoadingAccounts}>
                  {accounts?.map((account, index) => (
                    <option  key={index} value={account.uid}>{account.name}</option>
                  ))}
                </select>
              </span>
              <div className="form-errors">
                {errors.to_account && <p>{errors.to_account}</p>}
              </div>
            </>
          )}

          {(formData.type === INSTALLMENTS_TRANSACTION_TYPE ) && (
            <>
            <span className="form-input-span">
                <label className="form-label">Cuotas</label>
                <input
                  type="number"
                  name="installments"
                  min={2}
                  max={12}
                  value={formData.installments}
                  onChange={handleChange}
                  required
                />
              </span>
              <div className="form-errors">
                {errors.installments && <p>{errors.installments}</p>}
              </div>
              {(formData.installment_number) && (
                <span className="form-input-span">
                  <label className="form-label">Numero de Cuota</label>
                  <input
                    value={formData.installment_number}
                    readOnly
                  />
                </span>
              )}
            </>
          )}
          <span className="form-input-span">
            <label className="form-label">Fecha de Aprobación</label>
            <input
              type="date"
              name="approval_date"
              value={formData.approval_date}
              onChange={handleChange}
                />
          </span>
          <div className="form-errors">
            {errors.approval_date && <p>{errors.approval_date}</p>}
          </div>
          <span className="form-input-span">
            <label className="form-label">Es mensual?</label>
          </span>
            <input
              type="checkbox"
              name="is_monthly"
              checked={formData.is_monthly}
              onChange={handleChange}
                />
          <div className="form-errors">
            {errors.is_monthly && <p>{errors.is_monthly}</p>}
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
