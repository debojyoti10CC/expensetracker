import { Expense } from '../types';

// Try Firestore first, fallback to localStorage
let useFirestore = true;
let firestoreChecked = false;

// Helper function to generate unique IDs
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'expense_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Helper for delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const EXPENSES_KEY = 'kec_expenses';

// Quick Firestore check
const checkFirestore = async (): Promise<boolean> => {
  if (firestoreChecked) return useFirestore;
  
  try {
    const { db } = await import('./firebase');
    const { collection, getDocs } = await import('firebase/firestore');
    
    // Quick test with timeout
    const testPromise = getDocs(collection(db, 'test'));
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firestore timeout')), 3000)
    );
    
    await Promise.race([testPromise, timeoutPromise]);
    console.log('✅ Firestore is available');
    useFirestore = true;
  } catch (error) {
    console.log('📱 Firestore not available, using localStorage');
    useFirestore = false;
  }
  
  firestoreChecked = true;
  return useFirestore;
};

// Firestore functions (with error handling)
const tryFirestoreOperation = async <T>(operation: () => Promise<T>, fallback: () => Promise<T>): Promise<T> => {
  const canUseFirestore = await checkFirestore();
  
  if (!canUseFirestore) {
    return fallback();
  }
  
  try {
    return await operation();
  } catch (error) {
    console.warn('Firestore operation failed, falling back to localStorage:', error);
    useFirestore = false; // Disable Firestore for this session
    return fallback();
  }
};

// localStorage fallback functions
const getExpensesFromLocalStorage = async (userId: string): Promise<Expense[]> => {
  await delay(300);
  const allStr = localStorage.getItem(EXPENSES_KEY);
  let all: Expense[] = allStr ? JSON.parse(allStr) : [];
  
  const userExpenses = all.filter(e => e.userId === userId);
  if (userExpenses.length === 0) {
    const sampleExpenses = createSampleExpenses(userId);
    all.push(...sampleExpenses);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(all));
    return sampleExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  return userExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const addExpenseToLocalStorage = async (data: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
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

const updateExpenseInLocalStorage = async (expenseId: string, data: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
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

const deleteExpenseFromLocalStorage = async (expenseId: string): Promise<void> => {
  await delay(300);
  const allStr = localStorage.getItem(EXPENSES_KEY);
  let all: Expense[] = allStr ? JSON.parse(allStr) : [];
  all = all.filter(e => e.id !== expenseId);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(all));
};

// Sample data creation
const createSampleExpenses = (userId: string): Expense[] => {
  const today = new Date();
  const sampleExpenses: Omit<Expense, 'id' | 'createdAt'>[] = [
    {
      userId,
      amount: 25.50,
      category: 'Food',
      note: 'Lunch at downtown cafe',
      date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      userId,
      amount: 45.00,
      category: 'Transport',
      note: 'Gas for the car',
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      userId,
      amount: 120.00,
      category: 'Utilities',
      note: 'Monthly internet bill',
      date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      userId,
      amount: 15.99,
      category: 'Entertainment',
      note: 'Netflix subscription',
      date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      userId,
      amount: 85.00,
      category: 'Health',
      note: 'Doctor visit copay',
      date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  ];

  return sampleExpenses.map(expense => ({
    ...expense,
    id: generateId(),
    createdAt: Date.now() - Math.random() * 1000000
  }));
};

// Main API functions
export const getExpenses = async (userId: string): Promise<Expense[]> => {
  return tryFirestoreOperation(
    async () => {
      // Import Firestore API dynamically
      const { getExpenses: getFirestoreExpenses } = await import('./firestoreApi');
      return getFirestoreExpenses(userId);
    },
    () => getExpensesFromLocalStorage(userId)
  );
};

export const addExpense = async (data: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
  return tryFirestoreOperation(
    async () => {
      const { addExpense: addFirestoreExpense } = await import('./firestoreApi');
      return addFirestoreExpense(data);
    },
    () => addExpenseToLocalStorage(data)
  );
};

export const updateExpense = async (expenseId: string, data: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
  return tryFirestoreOperation(
    async () => {
      const { updateExpense: updateFirestoreExpense } = await import('./firestoreApi');
      return updateFirestoreExpense(expenseId, data);
    },
    () => updateExpenseInLocalStorage(expenseId, data)
  );
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  return tryFirestoreOperation(
    async () => {
      const { deleteExpense: deleteFirestoreExpense } = await import('./firestoreApi');
      return deleteFirestoreExpense(expenseId);
    },
    () => deleteExpenseFromLocalStorage(expenseId)
  );
};