export type Expense = {
  id: number;
  amount: string;
  description: string;
  paid_by: string;
  split_type: string;
  split_data?: string;
  created_at: Date | string;
};

export type Person = {
  id: number;
  name: string;
  created_at: Date | string;
};

export type PersonBalance = {
  name: string;
  totalPaid: number;
  totalOwed: number;
  balance: number;
  expenseCount: number;
};

export type SettlementSummary = {
  from: string;
  to: string;
  amount: number;
};

export type Settlement = {
  id: number;
  from_person: string;
  to_person: string;
  amount: string;
  is_settled: number;
  created_at: Date | string;
};
