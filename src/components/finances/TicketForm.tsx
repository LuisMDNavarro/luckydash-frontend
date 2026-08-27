import React, { useState } from 'react'
import type { Ticket } from '../../types/finance'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type {
  GetAccountsResponse,
  GetCategoriesResponse,
} from '../../types/finance'
import { getAccounts, getCategories } from '../../api/finance'
import type { AxiosError } from 'axios'
import { getToday } from '../utils/date'
import { EXPENSE_TYPE } from '../../types/finance'

type TicketFormProps = {
  initialData?: Partial<Ticket>
  onSubmit: (data: Ticket) => void
  isLoading?: boolean
  submitLabel?: string
  backendErrors?: Record<string, string[]>
}

export default function TicketForm({
  initialData,
  onSubmit,
  isLoading,
  submitLabel = 'Crear',
  backendErrors,
}: TicketFormProps) {
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

  const availableCategories =
    categories?.filter((category) => EXPENSE_TYPE.includes(category.type)) ?? []

  const [formData, setFormData] = useState<Ticket>({
    account: initialData?.account || accounts?.[0]?.uid || '',
    description: initialData?.description || '',
    purchase_date: initialData?.purchase_date || getToday(),
    approval_date: initialData?.approval_date || '',
    transactions: initialData?.transactions || [
      { category: categories?.[0]?.uid || '', amount: '0.00', description: '' },
    ],
  })

  console.log(initialData)

  useEffect(() => {
    if (initialData) {
      const account_uid = initialData.account?.split('-[')[0]
      setFormData({
        account: account_uid ?? accounts?.[0]?.uid ?? '',
        description: initialData.description ?? '',
        purchase_date:
          initialData.purchase_date ?? new Date().toISOString().split('T')[0],
        approval_date: initialData.approval_date ?? '',
        transactions: initialData.transactions ?? [
          {
            category: categories?.[0]?.uid || '',
            amount: '0.00',
            description: '',
          },
        ],
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

  const handleTransactionChange = (
    index: number,
    field: 'category' | 'amount' | 'description',
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((transaction, i) =>
        i === index
          ? {
              ...transaction,
              [field]: value,
            }
          : transaction,
      ),
    }))
  }

  const handleBlur = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value
    if (!value) return
    const number = parseFloat(value)
    if (!isNaN(number)) {
      setFormData((prev) => ({
        ...prev,
        transactions: prev.transactions.map((transaction, i) =>
          i === index
            ? {
                ...transaction,
                ['amount']: number.toFixed(2),
              }
            : transaction,
        ),
      }))
    }
  }

  const handleDecimalChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value
    const decimalRegex = /^\d*\.?\d{0,2}$/
    if (decimalRegex.test(value)) {
      setFormData((prev) => ({
        ...prev,
        transactions: prev.transactions.map((transaction, i) =>
          i === index
            ? {
                ...transaction,
                ['amount']: value,
              }
            : transaction,
        ),
      }))
    }
  }

  const addTransaction = () => {
    setFormData((prev) => ({
      ...prev,
      transactions: [
        ...prev.transactions,
        {
          category: categories?.[0]?.uid || '',
          amount: '0.00',
          description: '',
        },
      ],
    }))
  }

  const removeTransaction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string[]> = {}
    const validAccounts = accounts?.map((o) => o.uid)
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

    if (!validAccounts?.includes(formData.account)) {
      newErrors.from_account = ['Cuenta inválida']
    }

    if (formData.description.length == 0) {
      newErrors.description = ['Este campo no puede estar vacio']
    }

    if (formData.description.length > 255) {
      newErrors.description = ['Máximo 255 caracteres permitidos']
    }

    if (
      formData.purchase_date.length > 0 &&
      !dateRegex.test(formData.purchase_date)
    ) {
      newErrors.purchase_date = ['La fecha no es valida']
    }

    if (
      formData.approval_date &&
      formData.approval_date.length > 0 &&
      !dateRegex.test(formData.approval_date)
    ) {
      newErrors.approval_date = ['La fecha no es valida']
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
            <h2>Ticket</h2>
          </div>
          <span className="form-input-span">
            <label className="form-label">Cuenta origen</label>
            <select
              name="account"
              value={formData.account}
              onChange={handleChange}
              disabled={isLoadingAccounts}
            >
              {accounts?.map((account, index) => (
                <option key={index} value={account.uid}>
                  {account.name}
                </option>
              ))}
            </select>
          </span>
          <div className="form-errors">
            {errors.account && <p>{errors.account}</p>}
          </div>
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
          <div className="transactions">
            {formData.transactions.map((transaction, index) => (
              <div className="transaction" key={index}>
                <div className="simple-transaction">
                  <strong>Transacción {index + 1}</strong>
                  {(formData.transactions.length > 1 || initialData) && (
                    <button
                      className="clean-button"
                      type="button"
                      onClick={() => removeTransaction(index)}
                    >
                      <span className="icon-park-twotone--delete"></span>
                    </button>
                  )}
                </div>
                <span className="form-input-span">
                  <label className="form-label">Categoría</label>
                  <select
                    value={transaction.category}
                    onChange={(e) =>
                      handleTransactionChange(index, 'category', e.target.value)
                    }
                    disabled={isLoadingCategories}
                  >
                    {availableCategories?.map((category) => (
                      <option key={category.uid} value={category.uid}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </span>
                <span className="form-input-span">
                  <label className="form-label">Monto</label>
                  <input
                    type="number"
                    value={transaction.amount}
                    onChange={(e) => handleDecimalChange(e, index)}
                    onBlur={(e) => handleBlur(e, index)}
                  />
                </span>
                <span className="form-input-span">
                  <label className="form-label">Descripción</label>
                  <input
                    type="text"
                    value={transaction.description}
                    onChange={(e) =>
                      handleTransactionChange(
                        index,
                        'description',
                        e.target.value,
                      )
                    }
                    required
                  />
                </span>
              </div>
            ))}
            <button
              className="clean-button"
              type="button"
              onClick={addTransaction}
            >
              <span className="icon-park-outline--add-white"></span>
            </button>
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
