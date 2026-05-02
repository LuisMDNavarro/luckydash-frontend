import Swal from 'sweetalert2'

export const DeleteAlert = Swal.mixin({
  text: 'No podrás revertir esta acción',
  icon: 'warning',
  customClass: {
    popup: 'delete-alert',
  },
  showCancelButton: true,
  confirmButtonText: 'Sí, eliminar',
  cancelButtonText: 'Cancelar',
  confirmButtonColor: '#b42f2f',
  cancelButtonColor: '#6b7280',
})

export const SuccessDeleteAlert = Swal.mixin({
  title: 'Eliminado',
  icon: 'success',
  customClass: {
    popup: 'delete-alert',
  },
})
