import { Expense } from '../types';

// Helper function to generate unique IDs
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'expense_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// ------------------------------------------------------------------
// BACKEND CONFIGURATION
// ------------------------------------------------------------------
// Set this to true to connect to your Node.js/Express backend.
// When false, the app uses LocalStorage (Mock) for demonstration.
const USE_NODE_BACKEND = false; 

// The URL of your Node.js API (e.g., http://localhost:5000/api)
const API_BASE_URL = 'http://localhost:5000/api';

// Helper for delays in mock mode
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const EXPENSES_KEY = 'kec_expenses';



// ------------------------------------------------------------------
// API SERVICE
// ------------------------------------------------------------------

export const getExpenses = async (userId: string): Promise<Expense[]> => {
  // 1. Node.js Backend Mode
  if (USE_NODE_BACKEND) {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses?userId=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      const data = await response.json();
      // Ensure date strings are handled correctly for sorting
      return data.sort((a: Expense, b: Expense) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error("Failed to fetch from Node backend:", error);
      throw error;
    }
  }

  // 2. Mock / LocalStorage Mode
  await delay(300);
  const allStr = localStorage.getItem(EXPENSES_KEY);
  let all: Expense[] = allStr ? JSON.parse(allStr) : [];
  
  // Get user expenses without adding sample data
  const userExpenses = all.filter(e => e.userId === userId);
  return userExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addExpense = async (data: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
  // 1. Node.js Backend Mode
  if (USE_NODE_BACKEND) {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return await response.json();
  }

  // 2. Mock / LocalStorage Mode
  await delay(300);
  const allStr = localStorage.getItem(EXPENSES_KEY);
  const all: Expense[] = allStr ? JSON.parse(allStr) : [];

  const newExpense: Expense = {
    id: generateId(),
    createdAt: Date.now(),
    ...data
  };

  all.push(newExpense);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(all));
  return newExpense;
};

export const updateExpense = async (expenseId: string, data: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
  // 1. Node.js Backend Mode
  if (USE_NODE_BACKEND) {
    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return await response.json();
  }

  // 2. Mock / LocalStorage Mode
  await delay(300);
  const allStr = localStorage.getItem(EXPENSES_KEY);
  let all: Expense[] = allStr ? JSON.parse(allStr) : [];
  
  const index = all.findIndex(e => e.id === expenseId);
  if (index === -1) throw new Error('Expense not found');
  
  const updatedExpense: Expense = {
    ...all[index],
    ...data,
    id: expenseId
  };
  
  all[index] = updatedExpense;
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(all));
  return updatedExpense;
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  // 1. Node.js Backend Mode
  if (USE_NODE_BACKEND) {
    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return;
  }

  // 2. Mock / LocalStorage Mode
  await delay(300);
  const allStr = localStorage.getItem(EXPENSES_KEY);
  let all: Expense[] = allStr ? JSON.parse(allStr) : [];
  all = all.filter(e => e.id !== expenseId);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(all));
};
