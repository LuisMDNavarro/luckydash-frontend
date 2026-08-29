import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import '../../styles/Layout.css'
import AccountForm from '../../components/finances/AccountForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Account } from '../../types/finance'
import { AxiosError } from 'axios'
import { createAccount } from '../../api/finance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function CreateAccount() {
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const mutation = useMutation<
    Account,
    AxiosError<Record<string, string[]>>,
    Account
  >({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Cuenta creada')
      navigate('/wallet/accounts/list')
    },
    onError: (error) => {
      toast.error('Error al crear la cuenta')
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
            <AccountForm
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
