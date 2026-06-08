export const CASH_TYPE = 'cash'
export const DEBIT_TYPE = 'debit'
export const CREDIT_TYPE = 'credit'
export const ACCOUNT_TYPES = [
  { value: CASH_TYPE, label: 'Efectivo' },
  { value: DEBIT_TYPE, label: 'Débito' },
  { value: CREDIT_TYPE, label: 'Crédito' },
] as const
export type AccountType = (typeof ACCOUNT_TYPES)[number]['value']

export interface Account {
  uid?: string
  name: string
  color: string
  type: AccountType
  savings: string
  amount: string
  credit_limit: string
  billing_date: number
  payment_deadline: number
}

export type GetAccountsResponse = Account[]

export interface UpdateAccountRequest {
  uid: string
  account: Partial<Account>
}

export const EXPENSES_TYPE = 'expenses'
export const INCOME_TYPE = 'income'
export const CATEGORY_TYPES = [
  { value: EXPENSES_TYPE, label: 'Gastos' },
  { value: INCOME_TYPE, label: 'Ingresos' },
] as const
export type CategoryType = (typeof CATEGORY_TYPES)[number]['value']

export interface Category {
  uid?: string
  name: string
  color: string
  type: CategoryType
}

export type GetCategoriesResponse = Category[]

export interface UpdateCategoryRequest {
  uid: string
  category: Partial<Category>
}
