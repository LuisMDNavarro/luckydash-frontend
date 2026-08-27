import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import '../../styles/Layout.css'
import TicketForm from '../../components/finances/TicketForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Ticket } from '../../types/finance'
import { AxiosError } from 'axios'
import { createTicket } from '../../api/finance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function CreateTicket() {
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const mutation = useMutation<
    Ticket,
    AxiosError<Record<string, string[]>>,
    Ticket
  >({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Ticket creado')
      navigate('/wallet/tickets/list')
    },
    onError: (error) => {
      toast.error('Error al crear el ticket')
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
            <TicketForm
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
