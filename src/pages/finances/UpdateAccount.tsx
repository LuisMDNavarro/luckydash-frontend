import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import '../../styles/Layout.css'
import AccountForm from '../../components/finances/AccountForm'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Account } from '../../types/finance'
import { AxiosError } from 'axios'
import { getAccount, updateAccount } from '../../api/finance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loader from '../../components/utils/Loader'
import Error from '../../components/utils/Error'
import type { UpdateAccountRequest } from '../../types/finance'
import { useParams } from 'react-router-dom'

export default function UpdateAccount() {
  const { uid } = useParams<{ uid: string }>()
  const {
    data: account,
    isLoading,
    isError,
  } = useQuery<Account, AxiosError<Account>>({
    queryKey: ['account', uid],
    queryFn: () => getAccount(uid!),
    enabled: !!uid,
  })
  useEffect(() => {
    if (isError) {
      toast.error('Error al cargar la Cuenta')
    }
  }, [isError])

  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const mutation = useMutation<
    Account,
    AxiosError<Record<string, string[]>>,
    UpdateAccountRequest
  >({
    mutationFn: updateAccount,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['account', variables.uid] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Cuenta actualizada')
      navigate('/wallet/accounts/list')
    },
    onError: (error) => {
      toast.error('Error al actualizar la cuenta')
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
              <Error message="No se pudo obtener la información de la Cuenta" />
            )}
            {account && uid && (
              <AccountForm
                initialData={account}
                onSubmit={(data) =>
                  mutation.mutate({ uid: uid, account: data })
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
