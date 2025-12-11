import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Calendar } from 'lucide-react';
import { Expense, ExpenseFilter, Category, CATEGORIES } from '../types';
import { ExpenseForm } from '../components/ExpenseForm';
import * as api from '../services/mockApi';

interface ExpensesPageProps {
  userId: string;
  expenses: Expense[];
  onRefresh: () => void;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ userId, expenses, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filter, setFilter] = useState<ExpenseFilter>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filter.category || filter.category === 'All' || expense.category === filter.category;
    
    const matchesDateRange = (!filter.startDate || expense.date >= filter.startDate) &&
                            (!filter.endDate || expense.date <= filter.endDate);
    
    return matchesSearch && matchesCategory && matchesDateRange;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = async (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.deleteExpense(expenseId);
        onRefresh();
      } catch (error) {
        console.error('Failed to delete expense:', error);
        alert('Failed to delete expense. Please try again.');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingExpense(null);
    onRefresh();
  };

  const getCategoryColor = (category: Category): string => {
    const colors: Record<Category, string> = {
      'Food': '#3b82f6',
      'Transport': '#10b981',
      'Utilities': '#f59e0b',
      'Entertainment': '#ef4444',
      'Health': '#8b5cf6',
      'Education': '#06b6d4',
      'Other': '#84cc16'
    };
    return colors[category];
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#333', margin: 0 }}>
          All Transactions
        </h1>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <Plus size={14} />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0',
        marginBottom: '20px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px'
        }}>
          {/* Search */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px' }}>
              Search
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px' }}>
              Category
            </label>
            <select
              value={filter.category || 'All'}
              onChange={(e) => setFilter({ ...filter, category: e.target.value as Category | 'All' })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px' }}>
              From Date
            </label>
            <input
              type="date"
              value={filter.startDate || ''}
              onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Date To */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px' }}>
              To Date
            </label>
            <input
              type="date"
              value={filter.endDate || ''}
              onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e0e0e0',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 120px 100px 80px',
          gap: '16px',
          padding: '16px 20px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
          fontSize: '12px',
          fontWeight: '600',
          color: '#666',
          textTransform: 'uppercase'
        }}>
          <div>Transaction</div>
          <div>Category</div>
          <div>Amount</div>
          <div>Actions</div>
        </div>

        {/* Transactions */}
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 100px 80px',
                  gap: '16px',
                  padding: '16px 20px',
                  borderBottom: '1px solid #f0f0f0',
                  alignItems: 'center',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                {/* Transaction Details */}
                <div>
                  <div style={{ fontWeight: '600', color: '#333', fontSize: '14px', marginBottom: '2px' }}>
                    {expense.note}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    {new Date(expense.date).toLocaleDateString()}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    backgroundColor: getCategoryColor(expense.category),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {expense.category}
                  </span>
                </div>

                {/* Amount */}
                <div style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>
                  ${expense.amount.toFixed(2)}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => handleEdit(expense)}
                    style={{
                      padding: '6px',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: '#f0f9ff',
                      color: '#3b82f6',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    style={{
                      padding: '6px',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: '#fef2f2',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                No transactions found
              </h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                {expenses.length === 0 
                  ? "Start by adding your first transaction"
                  : "Try adjusting your filters"
                }
              </p>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Add First Transaction
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expense Form Modal */}
      {showForm && (
        <ExpenseForm
          userId={userId}
          expense={editingExpense}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};