export const getToday = (): string => {
  const today = new Date()

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')
}

export const formatDate = (date: string): string => {
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}