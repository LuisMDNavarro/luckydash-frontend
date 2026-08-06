import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import '../../styles/Layout.css'
import TransactionForm from '../../components/finances/TransactionForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Transaction } from '../../types/finance'
import { AxiosError } from 'axios'
import { createTransaction } from '../../api/finance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function CreateTransaction() {
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const mutation = useMutation<
    Transaction,
    AxiosError<Record<string, string[]>>,
    Transaction
  >({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Transaccion creada')
      navigate('/wallet/transactions/list')
    },
    onError: (error) => {
      toast.error('Error al crear la transaccion')
      if (error.response?.data) {
        setErrors(error.response.data)
      }
    },
  })
  return (
    <>
      <div className="page-container-main-layoud">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="page-content">
            <TransactionForm
              onSubmit={(data) => mutation.mutate(data)}
              isLoading={mutation.isPending}
              backendErrors={errors}
            />
          </div>
        </div>
      </div>
    </>
  )
}
