import { useEffect } from 'react'
import Loader from '../utils/Loader'
import { getTickets, deleteTicket, getAccounts } from '../../api/finance'
import type {
  GetTicketsResponse,
  GetAccountsResponse,
} from '../../types/finance'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Error from '../utils/Error'
import type { AxiosError } from 'axios'
import { Link } from 'react-router-dom'
import { DeleteAlert, SuccessDeleteAlert } from '../utils/Alerts'
import { formatDate } from '../utils/date'

export default function TicketList() {
  const {
    data: tickets,
    isLoading,
    isError,
  } = useQuery<GetTicketsResponse, AxiosError<{ detail: string }>>({
    queryKey: ['tickets'],
    queryFn: getTickets,
  })
  useEffect(() => {
    if (isError) {
      toast.error('Error al cargar los Tickets')
    }
  }, [isError])

  const { data: accounts, isError: isErrorAccounts } = useQuery<
    GetAccountsResponse,
    AxiosError<{ detail: string }>
  >({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  })
  useEffect(() => {
    if (isErrorAccounts) {
      toast.error('Error al cargar las Cuentas')
    }
  }, [isErrorAccounts])

  const parsedTickets = tickets?.map((ticket) => ({
    ...ticket,
    account_uid: ticket.account.split('-[')[0],
    account_name: ticket.account.split('-[')[1].slice(0, -1),
  }))

  const formatCurrency = (amount: string | number): string =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount))

  const queryClient = useQueryClient()
  const mutation = useMutation<void, AxiosError, string>({
    mutationFn: deleteTicket,
    onSuccess: (_, uid) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['ticket', uid] })
    },
    onError: () => {
      toast.error('Error al eliminar el ticket')
    },
  })

  const handleDelete = async (uid: string) => {
    const result = await DeleteAlert.fire({
      title: '¿Eliminar ticket?',
    })

    if (result.isConfirmed) {
      await mutation.mutateAsync(uid)
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })

      SuccessDeleteAlert.fire({
        text: 'El ticket ha sido eliminado',
      })
    }
  }

  if (isLoading) return <Loader />
  if (isError)
    return <Error message="No se pudo obtener la información de los Tickets" />
  return (
    <>
      <table className="ticket-table">
        <thead>
          <tr>
            <th>Descripcion</th>
            <th>Cuenta</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {parsedTickets?.map((ticket, index) => (
            <tr
              key={index}
              style={{
                background: `${accounts?.find((account) => account.uid === ticket.account_uid)?.color}99`,
              }}
            >
              <td>{ticket.description}</td>
              <td>{ticket.account_name}</td>
              <td>${formatCurrency(ticket.total_amount ?? 0)}</td>
              <td>
                {formatDate(ticket.approval_date ?? ticket.purchase_date)}
              </td>
              <td className="edit-buttons">
                <Link to={`/wallet/tickets/update/${ticket.uid}`}>
                  <span className="lucide--edit"></span>
                </Link>
                <button
                  className="clean-button"
                  onClick={() => {
                    if (!ticket.uid) return
                    handleDelete(ticket.uid)
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
