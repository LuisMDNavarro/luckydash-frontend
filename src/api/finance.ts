import apiClient from './apiClient'
import type {
  Account,
  GetAccountsResponse,
  UpdateAccountRequest,
  Category,
  GetCategoriesResponse,
  UpdateCategoryRequest,
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

export const createCategory = async (data: Category): Promise<Category> => {
  const response = await apiClient.post<Category>('/finances/categories/', data)
  return response.data
}

export const getCategories = async (): Promise<GetCategoriesResponse> => {
  const response = await apiClient.get<GetCategoriesResponse>(
    '/finances/categories/',
  )
  return response.data
}

export const getCategory = async (uid: string): Promise<Category> => {
  const response = await apiClient.get<Category>(`/finances/categories/${uid}`)
  return response.data
}

export const updateCategory = async (
  data: UpdateCategoryRequest,
): Promise<Category> => {
  const response = await apiClient.patch<Category>(
    `/finances/categories/${data.uid}/`,
    data.category,
  )
  return response.data
}

export const deleteCategory = async (uid: string): Promise<void> => {
  await apiClient.delete(`/finances/categories/${uid}/`)
}
