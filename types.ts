export type Category = 'Food' | 'Transport' | 'Utilities' | 'Entertainment' | 'Health' | 'Education' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Expense {
  id: string;
  userId: string;
  date: string; // ISO Date string
  category: Category;
  amount: number;
  note: string;
  createdAt: number;
}

export interface ExpenseFilter {
  startDate?: string;
  endDate?: string;
  category?: Category | 'All';
}

export const CATEGORIES: Category[] = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Education', 'Other'];