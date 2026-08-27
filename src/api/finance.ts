import apiClient from './apiClient'
import type {
  Account,
  GetAccountsResponse,
  UpdateAccountRequest,
  Category,
  GetCategoriesResponse,
  UpdateCategoryRequest,
  Transaction,
  GetTransactionsResponse,
  UpdateTransactionRequest,
  Ticket,
  GetTicketsResponse,
  UpdateTicketRequest,
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

export const createTransaction = async (
  data: Transaction,
): Promise<Transaction> => {
  const response = await apiClient.post<Transaction>(
    '/finances/transactions/',
    data,
  )
  return response.data
}

export const getTransactions = async (): Promise<GetTransactionsResponse> => {
  const response = await apiClient.get<GetTransactionsResponse>(
    '/finances/transactions/',
  )
  return response.data
}

export const getTransaction = async (uid: string): Promise<Transaction> => {
  const response = await apiClient.get<Transaction>(
    `/finances/transactions/${uid}`,
  )
  return response.data
}

export const updateTransaction = async (
  data: UpdateTransactionRequest,
): Promise<Transaction> => {
  const response = await apiClient.patch<Transaction>(
    `/finances/transactions/${data.uid}/`,
    data.transaction,
  )
  return response.data
}

export const deleteTransaction = async (uid: string): Promise<void> => {
  await apiClient.delete(`/finances/transactions/${uid}/`)
}

export const createTicket = async (data: Ticket): Promise<Ticket> => {
  const response = await apiClient.post<Ticket>('/finances/tickets/', data)
  return response.data
}

export const getTickets = async (): Promise<GetTicketsResponse> => {
  const response = await apiClient.get<GetTicketsResponse>('/finances/tickets/')
  return response.data
}

export const getTicket = async (uid: string): Promise<Ticket> => {
  const response = await apiClient.get<Ticket>(`/finances/tickets/${uid}`)
  return response.data
}

export const updateTicket = async (
  data: UpdateTicketRequest,
): Promise<Ticket> => {
  const response = await apiClient.patch<Ticket>(
    `/finances/tickets/${data.uid}/`,
    data.ticket,
  )
  return response.data
}

export const deleteTicket = async (uid: string): Promise<void> => {
  await apiClient.delete(`/finances/tickets/${uid}/`)
}
