import { useEffect } from 'react'
import Loader from '../utils/Loader'
import {
  getTransactions,
  deleteTransaction,
  getCategories,
  getAccounts,
} from '../../api/finance'
import type {
  GetTransactionsResponse,
  GetCategoriesResponse,
  GetAccountsResponse,
} from '../../types/finance'
import { TRANSACTIONS_TYPES } from '../../types/finance'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Error from '../utils/Error'
import type { AxiosError } from 'axios'
import { Link } from 'react-router-dom'
import { DeleteAlert, SuccessDeleteAlert } from '../utils/Alerts'
import { formatDate } from '../utils/date'
import { getToday } from '../utils/date'
import { useState } from 'react'
import {
  EXPENSE_TYPE,
  INCOME_TYPE,
  INSTALLMENTS_TRANSACTION_TYPE,
  TRANSFER_TYPE,
  SAVINGS_EXPENSE_TYPE,
  SAVINGS_INCOME_TYPE,
} from '../../types/finance'

export default function TransactionList() {
  const [date, setDate] = useState(
    () => sessionStorage.getItem('transactionsDate') ?? getToday(),
  )
  const [isSearching, setIsSearching] = useState(false)
  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery<GetTransactionsResponse, AxiosError<{ detail: string }>>({
    queryKey: ['transactions'],
    queryFn: () => getTransactions(date, account, category),
  })
  useEffect(() => {
    if (isError) {
      toast.error('Error al cargar las Transacciones')
    }
  }, [isError])

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

  const parsedTransactions = transactions?.map((transaction) => ({
    ...transaction,
    category_uid: transaction.category.split('-[')[0],
    category_name: transaction.category.split('-[')[1].slice(0, -1),
    account_uid: transaction.from_account.split('-[')[0],
    account_name: transaction.from_account.split('-[')[1].slice(0, -1),
  }))

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

  const [category, setCategory] = useState(
    () => sessionStorage.getItem('transactionsCategory') ?? '',
  )
  const [account, setAccount] = useState(
    () => sessionStorage.getItem('transactionsAccount') ?? '',
  )

  const formatCurrency = (amount: string | number): string =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount))

  const queryClient = useQueryClient()
  const mutation = useMutation<void, AxiosError, string>({
    mutationFn: deleteTransaction,
    onSuccess: (_, uid) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transaction', uid] })
    },
    onError: () => {
      toast.error('Error al eliminar la transaccion')
    },
  })

  const handleDelete = async (uid: string) => {
    const result = await DeleteAlert.fire({
      title: '¿Eliminar transaccion?',
    })

    if (result.isConfirmed) {
      await mutation.mutateAsync(uid)
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })

      SuccessDeleteAlert.fire({
        text: 'La transaccion ha sido eliminada',
      })
    }
  }

  const handleSearch = async () => {
    setIsSearching(true)
    try {
      const data = await getTransactions(date, account, category)
      queryClient.setQueryData(['transactions'], data)
      sessionStorage.setItem('transactionsDate', date)
      sessionStorage.setItem('transactionsAccount', account)
      sessionStorage.setItem('transactionsCategory', category)
    } finally {
      setIsSearching(false)
    }
  }

  if (isLoading) return <Loader />
  if (isError)
    return (
      <Error message="No se pudo obtener la información de las Transacciones" />
    )
  return (
    <>
      {isLoading || isSearching ? <Loader /> : null}
      <div className="transactions-container">
        <div>
          <span className="form-input-span input-span-filters">
            <input
              type="date"
              name="filter_date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoadingCategories}
            >
              <option value="">Todas</option>
              {categories?.map((category, index) => (
                <option key={index} value={category.uid}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              name="account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              disabled={isLoadingAccounts}
            >
              <option value="">Todas</option>
              {accounts?.map((account, index) => (
                <option key={index} value={account.uid}>
                  {account.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="search-button"
              onClick={handleSearch}
            >
              <span className="ant-design--search-outlined"></span>
            </button>
          </span>
        </div>
        <table className="transaction-table">
          <caption>Ingresos</caption>
          <thead>
            <tr>
              <th>Descripcion</th>
              <th>Cuenta</th>
              <th>Categoria</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {parsedTransactions
              ?.filter((transaction) =>
                [INCOME_TYPE, SAVINGS_INCOME_TYPE].includes(transaction.type),
              )
              .map((transaction, index) => (
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
                    {formatDate(
                      transaction.approval_date ?? transaction.purchase_date,
                    )}
                  </td>
                  <td>
                    {TRANSACTIONS_TYPES.find(
                      (type) => type.value === transaction.type,
                    )?.label ?? transaction.type}
                  </td>
                  <td className="edit-buttons">
                    <Link to={`/wallet/transactions/update/${transaction.uid}`}>
                      <span className="lucide--edit"></span>
                    </Link>
                    <button
                      className="clean-button"
                      onClick={() => {
                        if (!transaction.uid) return
                        handleDelete(transaction.uid)
                      }}
                    >
                      <span className="icon-park-twotone--delete"></span>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <table className="transaction-table">
          <caption>Gastos</caption>
          <thead>
            <tr>
              <th>Descripcion</th>
              <th>Cuenta</th>
              <th>Categoria</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {parsedTransactions
              ?.filter((transaction) =>
                [
                  EXPENSE_TYPE,
                  INSTALLMENTS_TRANSACTION_TYPE,
                  SAVINGS_EXPENSE_TYPE,
                ].includes(transaction.type),
              )
              .map((transaction, index) => (
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
                    {formatDate(
                      transaction.approval_date ?? transaction.purchase_date,
                    )}
                  </td>
                  <td>
                    {TRANSACTIONS_TYPES.find(
                      (type) => type.value === transaction.type,
                    )?.label ?? transaction.type}
                  </td>
                  <td className="edit-buttons">
                    <Link to={`/wallet/transactions/update/${transaction.uid}`}>
                      <span className="lucide--edit"></span>
                    </Link>
                    <button
                      className="clean-button"
                      onClick={() => {
                        if (!transaction.uid) return
                        handleDelete(transaction.uid)
                      }}
                    >
                      <span className="icon-park-twotone--delete"></span>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <table className="transaction-table">
          <caption>Transferencias</caption>
          <thead>
            <tr>
              <th>Descripcion</th>
              <th>Cuenta</th>
              <th>Categoria</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {parsedTransactions
              ?.filter((transaction) => transaction.type === TRANSFER_TYPE)
              .map((transaction, index) => (
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
                    {formatDate(
                      transaction.approval_date ?? transaction.purchase_date,
                    )}
                  </td>
                  <td>
                    {TRANSACTIONS_TYPES.find(
                      (type) => type.value === transaction.type,
                    )?.label ?? transaction.type}
                  </td>
                  <td className="edit-buttons">
                    <Link to={`/wallet/transactions/update/${transaction.uid}`}>
                      <span className="lucide--edit"></span>
                    </Link>
                    <button
                      className="clean-button"
                      onClick={() => {
                        if (!transaction.uid) return
                        handleDelete(transaction.uid)
                      }}
                    >
                      <span className="icon-park-twotone--delete"></span>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
