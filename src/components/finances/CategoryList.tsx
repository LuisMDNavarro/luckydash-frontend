import { useEffect } from 'react'
import Loader from '../utils/Loader'
import { getCategories, deleteCategory } from '../../api/finance'
import type { GetCategoriesResponse } from '../../types/finance'
import { CATEGORY_TYPES } from '../../types/finance'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Error from '../utils/Error'
import type { AxiosError } from 'axios'
import { Link } from 'react-router-dom'
import { DeleteAlert, SuccessDeleteAlert } from '../utils/Alerts'

export default function CategoryList() {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<GetCategoriesResponse, AxiosError<{ detail: string }>>({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
  useEffect(() => {
    if (isError) {
      toast.error('Error al cargar las Categorias')
    }
  }, [isError])

  const queryClient = useQueryClient()
  const mutation = useMutation<void, AxiosError, string>({
    mutationFn: deleteCategory,
    onSuccess: (_, uid) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category', uid] })
    },
    onError: () => {
      toast.error('Error al eliminar la categoria')
    },
  })

  const handleDelete = async (uid: string) => {
    const result = await DeleteAlert.fire({
      title: '¿Eliminar categoria?',
    })

    if (result.isConfirmed) {
      await mutation.mutateAsync(uid)

      SuccessDeleteAlert.fire({
        text: 'La categoria ha sido eliminada',
      })
    }
  }

  if (isLoading) return <Loader />
  if (isError)
    return (
      <Error message="No se pudo obtener la información de las Categorias" />
    )
  return (
    <>
      <table className="category-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((category, index) => (
            <tr key={index} style={{ background: `${category.color}99` }}>
              <td>{category.name}</td>
              <td>
                {CATEGORY_TYPES.find((type) => type.value === category.type)
                  ?.label ?? category.type}
              </td>
              <td className="edit-buttons">
                <Link to={`/wallet/categories/update/${category.uid}`}>
                  <span className="lucide--edit"></span>
                </Link>
                <button
                  className="clean-button"
                  onClick={() => {
                    if (!category.uid) return
                    handleDelete(category.uid)
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
