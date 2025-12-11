import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Calendar, DollarSign, Sparkles, Zap } from 'lucide-react';
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

  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto'
  };

  // Creative header with asymmetric design
  const headerSectionStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '40px',
    gap: '32px'
  };

  const titleContainerStyle: React.CSSProperties = {
    flex: 1
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-2px',
    lineHeight: '1.1',
    transform: 'rotate(-1deg)'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '18px',
    color: '#718096',
    marginTop: '8px',
    transform: 'rotate(-1deg)'
  };

  const addButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(237, 137, 54, 0.3)',
    transform: 'rotate(1deg)'
  };

  // Creative filters section
  const filtersContainerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
    borderRadius: '24px',
    padding: '32px',
    marginBottom: '32px',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #e2e8f0'
  };

  const filtersDecorStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '150px',
    height: '150px',
    background: 'linear-gradient(45deg, rgba(72, 187, 120, 0.1), rgba(56, 161, 105, 0.05))',
    borderRadius: '50% 30% 70% 40%',
    transform: 'rotate(25deg)'
  };

  const filterGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    position: 'relative',
    zIndex: 2
  };

  const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '700',
    color: '#2d3748',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const inputStyle: React.CSSProperties = {
    padding: '16px 20px',
    border: '2px solid #e2e8f0',
    borderRadius: '16px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
    background: 'white',
    fontWeight: '500'
  };

  // Creative expense cards with varied layouts
  const expensesGridStyle: React.CSSProperties = {
    display: 'grid',
    gap: '20px'
  };

  const createExpenseCardStyle = (index: number): React.CSSProperties => {
    const rotations = ['rotate(0.5deg)', 'rotate(-0.3deg)', 'rotate(0.2deg)', 'rotate(-0.4deg)'];
    const rotation = rotations[index % rotations.length];
    
    return {
      background: 'white',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f7fafc',
      transition: 'all 0.3s ease',
      transform: rotation,
      position: 'relative',
      overflow: 'hidden'
    };
  };

  const expenseContentStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto auto',
    alignItems: 'center',
    gap: '20px'
  };

  const categoryIconStyle = (category: Category): React.CSSProperties => {
    const colors: Record<Category, string> = {
      'Food': '#f56565',
      'Transport': '#4299e1',
      'Utilities': '#48bb78',
      'Entertainment': '#9f7aea',
      'Health': '#ed8936',
      'Education': '#38b2ac',
      'Other': '#718096'
    };

    return {
      width: '56px',
      height: '56px',
      borderRadius: '16px',
      background: `linear-gradient(135deg, ${colors[category]}, ${colors[category]}dd)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: 'white',
      fontWeight: 'bold',
      boxShadow: `0 8px 20px ${colors[category]}40`
    };
  };

  const expenseDetailsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  };

  const expenseNoteStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    letterSpacing: '-0.3px'
  };

  const expenseDateStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#718096',
    fontWeight: '500'
  };

  const expenseAmountStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '900',
    color: '#1a202c',
    letterSpacing: '-0.5px'
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px'
  };

  const actionButtonStyle = (color: string): React.CSSProperties => ({
    padding: '12px',
    border: 'none',
    borderRadius: '12px',
    background: `${color}15`,
    color: color,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600'
  });

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '80px 40px',
    background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
    borderRadius: '24px',
    border: '2px dashed #cbd5e0',
    transform: 'rotate(-0.5deg)'
  };

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

  const getCategoryIcon = (category: Category): string => {
    const icons: Record<Category, string> = {
      'Food': '🍽️',
      'Transport': '🚗',
      'Utilities': '⚡',
      'Entertainment': '🎬',
      'Health': '🏥',
      'Education': '📚',
      'Other': '📦'
    };
    return icons[category];
  };

  return (
    <div style={containerStyle}>
      {/* Creative Header */}
      <div style={headerSectionStyle}>
        <div style={titleContainerStyle}>
          <h1 style={titleStyle}>Transactions</h1>
          <p style={subtitleStyle}>
            Manage and track all your expenses
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={addButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(1deg) translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(237, 137, 54, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(1deg)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(237, 137, 54, 0.3)';
          }}
        >
          <Plus size={20} />
          Add New
        </button>
      </div>

      {/* Creative Filters */}
      <div style={filtersContainerStyle}>
        <div style={filtersDecorStyle} />
        <div style={filterGridStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <Search size={16} />
              Search
            </label>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#ed8936';
                e.target.style.boxShadow = '0 0 0 3px rgba(237, 137, 54, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <Filter size={16} />
              Category
            </label>
            <select
              value={filter.category || 'All'}
              onChange={(e) => setFilter({ ...filter, category: e.target.value as Category | 'All' })}
              style={inputStyle}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <Calendar size={16} />
              From Date
            </label>
            <input
              type="date"
              value={filter.startDate || ''}
              onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <Calendar size={16} />
              To Date
            </label>
            <input
              type="date"
              value={filter.endDate || ''}
              onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Creative Expenses List */}
      <div style={expensesGridStyle}>
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense, index) => (
            <div
              key={expense.id}
              style={createExpenseCardStyle(index)}
              onMouseEnter={(e) => {
                const currentTransform = e.currentTarget.style.transform;
                e.currentTarget.style.transform = currentTransform + ' translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                const rotations = ['rotate(0.5deg)', 'rotate(-0.3deg)', 'rotate(0.2deg)', 'rotate(-0.4deg)'];
                const rotation = rotations[index % rotations.length];
                e.currentTarget.style.transform = rotation;
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.08)';
              }}
            >
              {/* Decorative element */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '60px',
                height: '60px',
                background: 'linear-gradient(45deg, rgba(237, 137, 54, 0.1), rgba(221, 107, 32, 0.05))',
                borderRadius: '50%',
                transform: 'rotate(15deg)'
              }} />
              
              <div style={expenseContentStyle}>
                <div style={categoryIconStyle(expense.category)}>
                  {getCategoryIcon(expense.category)}
                </div>
                
                <div style={expenseDetailsStyle}>
                  <div style={expenseNoteStyle}>{expense.note}</div>
                  <div style={expenseDateStyle}>
                    {new Date(expense.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    background: '#f7fafc',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginTop: '4px'
                  }}>
                    {expense.category}
                  </div>
                </div>

                <div style={expenseAmountStyle}>
                  ${expense.amount.toFixed(2)}
                </div>

                <div style={actionsStyle}>
                  <button
                    onClick={() => handleEdit(expense)}
                    style={actionButtonStyle('#4299e1')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#4299e130';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#4299e115';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    style={actionButtonStyle('#f56565')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f5656530';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f5656515';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={emptyStateStyle}>
            <Zap size={80} style={{ margin: '0 auto 24px', color: '#cbd5e0' }} />
            <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '12px' }}>
              No transactions found
            </h3>
            <p style={{ fontSize: '18px', color: '#718096', marginBottom: '32px' }}>
              {expenses.length === 0 
                ? "Ready to start tracking? Add your first expense!"
                : "Try adjusting your filters to find what you're looking for."
              }
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={{
                ...addButtonStyle,
                transform: 'rotate(0deg)'
              }}
            >
              <Sparkles size={20} />
              Create First Transaction
            </button>
          </div>
        )}
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