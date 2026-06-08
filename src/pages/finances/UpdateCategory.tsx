import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import '../../styles/Layout.css'
import CategoryForm from '../../components/finances/CategoryForm'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Category } from '../../types/finance'
import { AxiosError } from 'axios'
import { getCategory, updateCategory } from '../../api/finance'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loader from '../../components/utils/Loader'
import Error from '../../components/utils/Error'
import type { UpdateCategoryRequest } from '../../types/finance'
import { useParams } from 'react-router-dom'

export default function UpdateCategory() {
  const { uid } = useParams<{ uid: string }>()
  const {
    data: category,
    isLoading,
    isError,
  } = useQuery<Category, AxiosError<Category>>({
    queryKey: ['account', uid],
    queryFn: () => getCategory(uid!),
    enabled: !!uid,
  })
  useEffect(() => {
    if (isError) {
      toast.error('Error al cargar la Categoria')
    }
  }, [isError])

  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const mutation = useMutation<
    Category,
    AxiosError<Record<string, string[]>>,
    UpdateCategoryRequest
  >({
    mutationFn: updateCategory,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category', variables.uid] })
      toast.success('Categoria actualizada')
      navigate('/wallet/categories/list')
    },
    onError: (error) => {
      toast.error('Error al actualizar la categoria')
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
            {category && uid && (
              <CategoryForm
                initialData={category}
                onSubmit={(data) =>
                  mutation.mutate({ uid: uid, category: data })
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
