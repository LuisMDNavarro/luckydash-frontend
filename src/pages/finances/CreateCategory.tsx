import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import '../../styles/Layout.css'
import CategoryForm from '../../components/finances/CategoryForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Category } from '../../types/finance'
import { AxiosError } from 'axios'
import { createCategory } from '../../api/finance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function CreateCategory() {
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const mutation = useMutation<
    Category,
    AxiosError<Record<string, string[]>>,
    Category
  >({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Categoria creada')
      navigate('/wallet/categories/list')
    },
    onError: (error) => {
      toast.error('Error al crear la categoria')
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
            <CategoryForm
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
