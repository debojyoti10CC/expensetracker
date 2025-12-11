import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp 
} from "firebase/firestore";
import { db } from './firebase';
import { Expense } from '../types';

// Helper function to generate unique IDs (fallback)
const generateId = (): string => {
  return 'expense_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Helper to convert Firestore timestamp to date string
const timestampToDateString = (timestamp: any): string => {
  if (!timestamp) return new Date().toISOString().split('T')[0];
  if (timestamp.toDate) {
    return timestamp.toDate().toISOString().split('T')[0];
  }
  return new Date(timestamp).toISOString().split('T')[0];
};

// Helper to convert date string to Firestore timestamp
const dateStringToTimestamp = (dateString: string): Timestamp => {
  return Timestamp.fromDate(new Date(dateString));
};

// Collection reference
const EXPENSES_COLLECTION = 'expenses';

// Remove connection test - let Firestore handle it

// ------------------------------------------------------------------
// FIRESTORE API SERVICE
// ------------------------------------------------------------------

export const getExpenses = async (userId: string): Promise<Expense[]> => {
  try {
    console.log('🔥 Fetching expenses for user:', userId);
    
    const expensesRef = collection(db, EXPENSES_COLLECTION);
    
    // Try without orderBy first to avoid index issues
    const q = query(
      expensesRef, 
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(q);
    const expenses: Expense[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📄 Document data:', doc.id, data);
      expenses.push({
        id: doc.id,
        userId: data.userId,
        amount: data.amount,
        category: data.category,
        note: data.note,
        date: timestampToDateString(data.date),
        createdAt: data.createdAt?.toMillis() || Date.now()
      });
    });
    
    // Sort in JavaScript instead of Firestore
    expenses.sort((a, b) => b.createdAt - a.createdAt);
    
    console.log('✅ Fetched expenses:', expenses.length);
    
    // Return empty array if no expenses found
    if (expenses.length === 0) {
      console.log('📝 No expenses found for user');
    }
    
    return expenses;
  } catch (error: any) {
    console.error("❌ Error fetching expenses:", error);
    
    // Check if it's a Firestore not enabled error
    if (error.code === 'failed-precondition' || error.message?.includes('Firestore')) {
      console.error("🚨 Firestore is not enabled! Please enable Firestore in Firebase Console");
      throw new Error("Firestore database is not enabled. Please enable Firestore in your Firebase Console.");
    }
    
    throw new Error("Failed to fetch expenses: " + error.message);
  }
};

export const addExpense = async (data: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
  try {
    console.log('🔥 Adding expense:', data);
    
    const expenseData = {
      userId: data.userId,
      amount: data.amount,
      category: data.category,
      note: data.note,
      date: dateStringToTimestamp(data.date),
      createdAt: serverTimestamp()
    };
    
    console.log('📝 Expense data to save:', expenseData);
    
    const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), expenseData);
    
    const newExpense: Expense = {
      id: docRef.id,
      userId: data.userId,
      amount: data.amount,
      category: data.category,
      note: data.note,
      date: data.date,
      createdAt: Date.now()
    };
    
    console.log('✅ Added expense with ID:', docRef.id);
    return newExpense;
  } catch (error) {
    console.error("❌ Error adding expense:", error);
    console.error("Error details:", error);
    throw new Error("Failed to add expense to database: " + (error as Error).message);
  }
};

export const updateExpense = async (expenseId: string, data: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
  try {
    console.log('Updating expense:', expenseId, data);
    
    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    const updateData = {
      userId: data.userId,
      amount: data.amount,
      category: data.category,
      note: data.note,
      date: dateStringToTimestamp(data.date)
    };
    
    await updateDoc(expenseRef, updateData);
    
    const updatedExpense: Expense = {
      id: expenseId,
      userId: data.userId,
      amount: data.amount,
      category: data.category,
      note: data.note,
      date: data.date,
      createdAt: Date.now() // This would ideally be preserved from original
    };
    
    console.log('Updated expense:', expenseId);
    return updatedExpense;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw new Error("Failed to update expense in database");
  }
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  try {
    console.log('Deleting expense:', expenseId);
    
    const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await deleteDoc(expenseRef);
    
    console.log('Deleted expense:', expenseId);
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw new Error("Failed to delete expense from database");
  }
};

// Create sample expenses for new users
const createSampleExpenses = async (userId: string): Promise<Expense[]> => {
  const today = new Date();
  const sampleExpensesData = [
    {
      userId,
      amount: 25.50,
      category: 'Food' as const,
      note: 'Lunch at downtown cafe',
      date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      userId,
      amount: 45.00,
      category: 'Transport' as const,
      note: 'Gas for the car',
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      userId,
      amount: 120.00,
      category: 'Utilities' as const,
      note: 'Monthly internet bill',
      date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      userId,
      amount: 15.99,
      category: 'Entertainment' as const,
      note: 'Netflix subscription',
      date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      userId,
      amount: 85.00,
      category: 'Health' as const,
      note: 'Doctor visit copay',
      date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  ];

  const createdExpenses: Expense[] = [];
  
  for (const expenseData of sampleExpensesData) {
    try {
      const expense = await addExpense(expenseData);
      createdExpenses.push(expense);
    } catch (error) {
      console.error('Error creating sample expense:', error);
    }
  }
  
  return createdExpenses;
};