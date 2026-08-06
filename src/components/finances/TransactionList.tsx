import { useEffect } from 'react'
import Loader from '../utils/Loader'
import { getTransactions, deleteTransaction, getCategories } from '../../api/finance'
import type { GetTransactionsResponse, GetCategoriesResponse } from '../../types/finance'
import { TRANSACTIONS_TYPES } from '../../types/finance'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Error from '../utils/Error'
import type { AxiosError } from 'axios'
import { Link } from 'react-router-dom'
import { DeleteAlert, SuccessDeleteAlert } from '../utils/Alerts'
import { formatDate } from '../utils/date'

export default function TransactionList() {
  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery<GetTransactionsResponse, AxiosError<{ detail: string }>>({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  })
  useEffect(() => {
    if (isError) {
      toast.error('Error al cargar las Transacciones')
    }
  }, [isError])

  const {
      data: categories,
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

      SuccessDeleteAlert.fire({
        text: 'La transaccion ha sido eliminada',
      })
    }
  }

  if (isLoading) return <Loader />
  if (isError)
    return (
      <Error message="No se pudo obtener la información de las Transacciones" />
    )
  return (
    <>
      <table className="transaction-table">
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
          {parsedTransactions?.map((transaction, index) => (
            <tr key={index} style={{ background: `${categories?.find((category) => category.uid === transaction.category_uid)?.color}99` }}>
              <td>{transaction.description} {transaction.installments && <span>- {transaction.installment_number}/{transaction.installments}</span>}</td>
              <td>{transaction.account_name}</td>
              <td>{transaction.category_name}</td>
              <td>${formatCurrency(transaction.amount)}</td>
              <td>{formatDate(transaction.approval_date ?? transaction.purchase_date)}</td>
              <td>
                {TRANSACTIONS_TYPES.find((type) => type.value === transaction.type)
                  ?.label ?? transaction.type}
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
    </>
  )
}