import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import '../../styles/Layout.css'
import TransactionForm from '../../components/finances/TransactionForm'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Transaction } from '../../types/finance'
import { AxiosError } from 'axios'
import { getTransaction, updateTransaction } from '../../api/finance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loader from '../../components/utils/Loader'
import Error from '../../components/utils/Error'
import type { UpdateTransactionRequest } from '../../types/finance'
import { useParams } from 'react-router-dom'

export default function UpdateTransaction() {
  const { uid } = useParams<{ uid: string }>()
  const {
    data: transaction,
    isLoading,
    isError,
  } = useQuery<Transaction, AxiosError<Transaction>>({
    queryKey: ['transaction', uid],
    queryFn: () => getTransaction(uid!),
    enabled: !!uid,
  })
  useEffect(() => {
    if (isError) {
      toast.error('Error al cargar la Transaccion')
    }
  }, [isError])

  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const mutation = useMutation<
    Transaction,
    AxiosError<Record<string, string[]>>,
    UpdateTransactionRequest
  >({
    mutationFn: updateTransaction,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transaction', variables.uid] })
      toast.success('Transaccion actualizada')
      navigate('/wallet/transactions/list')
    },
    onError: (error) => {
      toast.error('Error al actualizar la transaccion')
      if (error.response?.data) {
        setErrors(error.response.data)
      }
    },
  })
  if (isLoading) return <Loader />
  return (
    <>
      <div className="page-container-main-layoud">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="page-content">
            {isError && (
              <Error message="No se pudo obtener la información de la Transaccion" />
            )}
            {transaction && uid && (
              <TransactionForm
                initialData={transaction}
                onSubmit={(data) =>
                  mutation.mutate({ uid: uid, transaction: data })
                }
                isLoading={mutation.isPending}
                backendErrors={errors}
                submitLabel="Actualizar"
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
