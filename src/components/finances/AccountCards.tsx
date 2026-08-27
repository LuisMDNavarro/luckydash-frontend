import React, { useEffect } from 'react'
import Loader from '../utils/Loader'
import { getAccounts, deleteAccount } from '../../api/finance'
import { CASH_TYPE, DEBIT_TYPE, CREDIT_TYPE } from '../../types/finance'
import type { GetAccountsResponse } from '../../types/finance'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Error from '../utils/Error'
import type { AxiosError } from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DeleteAlert, SuccessDeleteAlert } from '../utils/Alerts'

function chunkArray<T>(array: T[], size: number): T[][] {
  const result = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

export default function AccountsCards() {
  const {
    data: accounts,
    isLoading,
    isError,
  } = useQuery<GetAccountsResponse, AxiosError<{ detail: string }>>({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  })
  useEffect(() => {
    if (isError) {
      toast.error('Error al cargar las Cuentas')
    }
  }, [isError])
  const groupedAccounts = chunkArray(accounts ?? [], 4)
  const [expandedStacks, setExpandedStacks] = useState<number[]>([])

  const handleToggle = (index: number) => {
    setExpandedStacks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }

  const queryClient = useQueryClient()
  const mutation = useMutation<void, AxiosError, string>({
    mutationFn: deleteAccount,
    onSuccess: (_, uid) => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['account', uid] })
    },
    onError: () => {
      toast.error('Error al eliminar la cuenta')
    },
  })

  const handleDelete = async (uid: string) => {
    const result = await DeleteAlert.fire({
      title: '¿Eliminar cuenta?',
    })

    if (result.isConfirmed) {
      await mutation.mutateAsync(uid)

      SuccessDeleteAlert.fire({
        text: 'La cuenta ha sido eliminada',
      })
    }
  }

  if (isLoading) return <Loader />
  if (isError)
    return <Error message="No se pudo obtener la información de las Cuentas" />
  return (
    <>
      <div className="card-container">
        {groupedAccounts.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <div
              className="card-toggle"
              onClick={() => handleToggle(groupIndex)}
            >
              <span
                className={`${expandedStacks.includes(groupIndex) ? 'majesticons--arrows-collapse-full' : 'majesticons--arrows-expand-full'}`}
              ></span>
            </div>
            <div
              className={`card-stack ${expandedStacks.includes(groupIndex) ? 'expanded' : ''}`}
            >
              {group.map((account) => (
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
                    <div className="edit-buttons">
                      <Link to={`/wallet/accounts/update/${account.uid}`}>
                        <span className="lucide--edit"></span>
                      </Link>
                      <button
                        className="clean-button"
                        onClick={() => {
                          if (!account.uid) return
                          handleDelete(account.uid)
                        }}
                      >
                        <span className="icon-park-twotone--delete"></span>
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  )
}
