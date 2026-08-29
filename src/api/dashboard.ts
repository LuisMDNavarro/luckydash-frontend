import apiClient from './apiClient'
import type { GetDashboardResponse } from '../types/finance'

export const getDashboard = async (
  date: string,
): Promise<GetDashboardResponse> => {
  const response = await apiClient.get<GetDashboardResponse>(
    '/finances/dashboard/',
    { params: { date } },
  )
  return response.data
}
