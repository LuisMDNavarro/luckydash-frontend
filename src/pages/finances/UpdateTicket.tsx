import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import '../../styles/Layout.css'
import TicketForm from '../../components/finances/TicketForm'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Ticket } from '../../types/finance'
import { AxiosError } from 'axios'
import { getTicket, updateTicket } from '../../api/finance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loader from '../../components/utils/Loader'
import Error from '../../components/utils/Error'
import type { UpdateTicketRequest } from '../../types/finance'
import { useParams } from 'react-router-dom'

export default function UpdateTicket() {
  const { uid } = useParams<{ uid: string }>()
  const {
    data: ticket,
    isLoading,
    isError,
  } = useQuery<Ticket, AxiosError<Ticket>>({
    queryKey: ['ticket', uid],
    queryFn: () => getTicket(uid!),
    enabled: !!uid,
  })
  useEffect(() => {
    if (isError) {
      toast.error('Error al cargar el Ticket')
    }
  }, [isError])

  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const mutation = useMutation<
    Ticket,
    AxiosError<Record<string, string[]>>,
    UpdateTicketRequest
  >({
    mutationFn: updateTicket,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.uid] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Ticket actualizado')
      navigate('/wallet/tickets/list')
    },
    onError: (error) => {
      toast.error('Error al actualizar el ticket')
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
              <Error message="No se pudo obtener la información del Ticket" />
            )}
            {ticket && uid && (
              <TicketForm
                initialData={ticket}
                onSubmit={(data) => mutation.mutate({ uid: uid, ticket: data })}
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
