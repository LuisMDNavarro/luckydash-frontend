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
