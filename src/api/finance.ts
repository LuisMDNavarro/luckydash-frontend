import apiClient from './apiClient'
import type {
  Account,
  GetAccountsResponse,
  UpdateAccountRequest,
} from '../types/finance'

export const createAccount = async (data: Account): Promise<Account> => {
  const response = await apiClient.post<Account>('/finances/accounts/', data)
  return response.data
}

export const getAccounts = async (): Promise<GetAccountsResponse> => {
  const response = await apiClient.get<GetAccountsResponse>(
    '/finances/accounts/',
  )
  return response.data
}

export const getAccount = async (uid: string): Promise<Account> => {
  const response = await apiClient.get<Account>(`/finances/accounts/${uid}`)
  return response.data
}

export const updateAccount = async (
  data: UpdateAccountRequest,
): Promise<Account> => {
  const response = await apiClient.patch<Account>(
    `/finances/accounts/${data.uid}/`,
    data.account,
  )
  return response.data
}

export const deleteAccount = async (uid: string): Promise<void> => {
  await apiClient.delete(`/finances/accounts/${uid}/`)
}
