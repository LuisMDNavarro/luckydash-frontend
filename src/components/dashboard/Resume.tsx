import React, { useEffect } from 'react'
import Loader from '../utils/Loader'
import { CASH_TYPE, DEBIT_TYPE, CREDIT_TYPE } from '../../types/finance'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Error from '../utils/Error'
import type { AxiosError } from 'axios'
import { useState } from 'react'
import { getDashboard } from '../../api/dashboard'
import { getCategories } from '../../api/finance'
import type {
  GetDashboardResponse,
  GetCategoriesResponse,
} from '../../types/finance'
import { formatDate } from '../utils/date'
import { TRANSACTIONS_TYPES } from '../../types/finance'

export default function Resume() {
  const [date] = useState(new Date().toISOString().split('T')[0])
  const [year, month] = date.split('-')
  const {
    data: dashboard,
    isLoading,
    isError,
  } = useQuery<GetDashboardResponse, AxiosError<{ detail: string }>>({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard(date),
  })
  useEffect(() => {
    if (isError) {
      toast.error('Error al cargar las informacion')
    }
  }, [isError])

  const { data: categories, isError: isErrorCategories } = useQuery<
    GetCategoriesResponse,
    AxiosError<{ detail: string }>
  >({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
  useEffect(() => {
    if (isErrorCategories) {
      toast.error('Error al cargar las Categorias')
    }
  }, [isErrorCategories])

  const parsedTransactions = dashboard?.transactions.map((transaction) => ({
    ...transaction,
    category_uid: transaction.category.split('-[')[0],
    category_name: transaction.category.split('-[')[1].slice(0, -1),
    account_uid: transaction.from_account.split('-[')[0],
    account_name: transaction.from_account.split('-[')[1].slice(0, -1),
  }))

  const formatCurrency = (amount: string | number): string =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount))

  if (isLoading) return <Loader />
  if (isError) return <Error message="No se pudo obtener la información" />
  return (
    <>
      <div className="dashboard">
        <div className="dashboard-item item-1">
          <div className="card-container">
            <div className="card-stack  expanded">
              {dashboard?.accounts.map((account) => (
                <React.Fragment key={account.uid}>
                  <div
                    className="glass box"
                    style={{
                      background: `linear-gradient(${account.color}, transparent)`,
                    }}
                  >
                    <div>
                      <strong>{account.name}</strong>
                      {(account.type == CASH_TYPE ||
                        account.type == DEBIT_TYPE) && (
                        <>
                          <p>Ahorros: {account.savings}</p>
                          <p>Monto: {account.amount}</p>
                        </>
                      )}
                      {account.type == CREDIT_TYPE && (
                        <>
                          <p>
                            Crédito: {account.credit_available}/
                            {account.credit_limit}
                          </p>
                          <p>Fecha de corte: {account.billing_date}</p>
                          <p>
                            Fecha límite de pago: {account.payment_deadline}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="dashboard-item item-2">
          <p>Dinero Disponible: {dashboard?.available}</p>
          <p>Ahorro Actual: {dashboard?.savings}</p>
        </div>
        <div className="dashboard-item item-3">
          <h3>
            Resumen de Transacciones {month}/{year}
          </h3>
          <div>
            <p>Ingresos Totales: {dashboard?.incomes}</p>
            <p>Gastos Totales: {dashboard?.expenses}</p>
            <p>Promedios de gastos al dia: {dashboard?.average}</p>
          </div>
        </div>
        <div className="dashboard-item item-4">
          <h3>Transacciones del: {formatDate(date)}</h3>
          <div>
            <p>Ingresos: {dashboard?.incomes_day}</p>
            <p>Gastos: {dashboard?.expenses_day}</p>
            <p>Diferencia: {dashboard?.difference}</p>
          </div>
        </div>
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Descripcion</th>
                <th>Cuenta</th>
                <th>Categoria</th>
                <th>Monto</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {parsedTransactions?.map((transaction, index) => (
                <tr
                  key={index}
                  style={{
                    background: `${categories?.find((category) => category.uid === transaction.category_uid)?.color}99`,
                  }}
                >
                  <td>
                    {transaction.description}{' '}
                    {transaction.installments && (
                      <span>
                        - {transaction.installment_number}/
                        {transaction.installments}
                      </span>
                    )}
                  </td>
                  <td>{transaction.account_name}</td>
                  <td>{transaction.category_name}</td>
                  <td>${formatCurrency(transaction.amount)}</td>
                  <td>
                    {TRANSACTIONS_TYPES.find(
                      (type) => type.value === transaction.type,
                    )?.label ?? transaction.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
