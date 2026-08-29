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
  credit_available?: string
  billing_date: number
  payment_deadline: number
}

export type GetAccountsResponse = Account[]

export interface UpdateAccountRequest {
  uid: string
  account: Partial<Account>
}

export const EXPENSE_TYPE = 'expense'
export const INCOME_TYPE = 'income'
export const CATEGORY_TYPES = [
  { value: EXPENSE_TYPE, label: 'Gastos' },
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

export const INSTALLMENTS_TRANSACTION_TYPE = 'installments_expense'
export const TRANSFER_TYPE = 'transfer'
export const SAVINGS_EXPENSE_TYPE = 'savings_expense'
export const SAVINGS_INCOME_TYPE = 'savings_income'
export const TRANSACTIONS_TYPES = [
  { value: EXPENSE_TYPE, label: 'Gasto' },
  { value: INSTALLMENTS_TRANSACTION_TYPE, label: 'Gasto a Cuotas' },
  { value: INCOME_TYPE, label: 'Ingreso' },
  { value: TRANSFER_TYPE, label: 'Transferencia' },
  { value: SAVINGS_INCOME_TYPE, label: 'Ingreso de Ahorro' },
  { value: SAVINGS_EXPENSE_TYPE, label: 'Gasto de Ahorro' },
] as const
export type TransactionType = (typeof TRANSACTIONS_TYPES)[number]['value']

export interface Transaction {
  uid?: string
  ticket?: string
  from_account: string
  category: string
  type: TransactionType
  amount: string
  description: string
  purchase_date: string
  to_account?: string
  installments?: number | ''
  installment_number?: number | ''
  parent_transaction?: string
  approval_date?: string
  is_monthly: boolean
}

export type GetTransactionsResponse = Transaction[]

export interface UpdateTransactionRequest {
  uid: string
  transaction: Partial<Transaction>
}

export interface SimpleTransaction {
  category: string
  amount: string
  description: string
}

export interface Ticket {
  uid?: string
  account: string
  total_amount?: string
  description: string
  purchase_date: string
  approval_date?: string
  transactions: SimpleTransaction[]
}

export type GetTicketsResponse = Ticket[]

export interface UpdateTicketRequest {
  uid: string
  ticket: Partial<Ticket>
}

export type GetDashboardResponse = {
  accounts: Account[]
  available: string
  savings: string
  incomes: string
  expenses: string
  average: string
  incomes_day: string
  expenses_day: string
  difference: string
  transactions: Transaction[]
}
