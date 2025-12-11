import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Calendar, FileText, Tag, Sparkles } from 'lucide-react';
import { Expense, Category, CATEGORIES } from '../types';
import * as api from '../services/mockApi';

interface ExpenseFormProps {
  userId: string;
  expense?: Expense | null;
  onClose: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ userId, expense, onClose }) => {
  const [formData, setFormData] = useState({
    amount: expense?.amount.toString() || '',
    category: expense?.category || 'Food' as Category,
    note: expense?.note || '',
    date: expense?.date || new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(26, 32, 44, 0.8)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  };

  // Creative modal with organic shape
  const modalStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
    borderRadius: '32px 8px 32px 8px',
    padding: '40px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 40px 80px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto',
    transform: 'rotate(-0.5deg)'
  };

  // Decorative elements
  const decorStyle1: React.CSSProperties = {
    position: 'absolute',
    top: '-30px',
    right: '-30px',
    width: '120px',
    height: '120px',
    background: 'linear-gradient(45deg, rgba(237, 137, 54, 0.15), rgba(221, 107, 32, 0.08))',
    borderRadius: '50% 30% 70% 40%',
    transform: 'rotate(25deg)'
  };

  const decorStyle2: React.CSSProperties = {
    position: 'absolute',
    bottom: '-20px',
    left: '-20px',
    width: '80px',
    height: '80px',
    background: 'linear-gradient(45deg, rgba(72, 187, 120, 0.15), rgba(56, 161, 105, 0.08))',
    borderRadius: '30% 70% 50% 30%',
    transform: 'rotate(-15deg)'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    position: 'relative',
    zIndex: 2
  };

  const titleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const titleIconStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    transform: 'rotate(3deg)',
    boxShadow: '0 8px 20px rgba(237, 137, 54, 0.3)'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1a202c',
    letterSpacing: '-0.5px'
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'rgba(160, 174, 192, 0.15)',
    border: 'none',
    borderRadius: '16px',
    padding: '12px',
    cursor: 'pointer',
    color: '#718096',
    transition: 'all 0.3s ease',
    transform: 'rotate(-3deg)'
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    position: 'relative',
    zIndex: 2
  };

  const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2d3748',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const inputContainerStyle: React.CSSProperties = {
    position: 'relative'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '20px 20px 20px 56px',
    border: '3px solid #e2e8f0',
    borderRadius: '20px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
    background: 'white',
    boxSizing: 'border-box',
    fontWeight: '600'
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'inherit',
    paddingTop: '20px'
  };

  const iconContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '24px',
    height: '24px',
    color: '#a0aec0',
    pointerEvents: 'none'
  };

  const textareaIconContainerStyle: React.CSSProperties = {
    position: 'absolute',
    left: '20px',
    top: '24px',
    width: '24px',
    height: '24px',
    color: '#a0aec0',
    pointerEvents: 'none'
  };

  const errorStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
    border: '2px solid #fc8181',
    borderRadius: '16px',
    padding: '16px 20px',
    color: '#c53030',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    marginTop: '16px'
  };

  const buttonStyle = (variant: 'primary' | 'secondary'): React.CSSProperties => ({
    flex: 1,
    padding: '18px 24px',
    border: 'none',
    borderRadius: '18px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    ...(variant === 'primary' ? {
      background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
      color: 'white',
      boxShadow: '0 8px 25px rgba(237, 137, 54, 0.3)',
      transform: 'rotate(0.5deg)'
    } : {
      background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
      color: '#4a5568',
      border: '2px solid #e2e8f0',
      transform: 'rotate(-0.5deg)'
    })
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (!formData.note.trim()) {
        throw new Error('Please enter a note');
      }

      const expenseData = {
        userId,
        amount,
        category: formData.category,
        note: formData.note.trim(),
        date: formData.date
      };

      if (expense) {
        await api.updateExpense(expense.id, expenseData);
      } else {
        await api.addExpense(expenseData);
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save expense');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const getCategoryEmoji = (category: Category): string => {
    const emojis: Record<Category, string> = {
      'Food': '🍽️',
      'Transport': '🚗',
      'Utilities': '⚡',
      'Entertainment': '🎬',
      'Health': '🏥',
      'Education': '📚',
      'Other': '📦'
    };
    return emojis[category];
  };

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modalStyle}>
        <div style={decorStyle1} />
        <div style={decorStyle2} />
        
        {/* Header */}
        <div style={headerStyle}>
          <div style={titleContainerStyle}>
            <div style={titleIconStyle}>
              <Sparkles size={24} />
            </div>
            <h2 style={titleStyle}>
              {expense ? 'Edit Transaction' : 'New Transaction'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(160, 174, 192, 0.25)';
              e.currentTarget.style.transform = 'rotate(-3deg) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(160, 174, 192, 0.15)';
              e.currentTarget.style.transform = 'rotate(-3deg) scale(1)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Amount */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <DollarSign size={18} color="#ed8936" />
              Amount
            </label>
            <div style={inputContainerStyle}>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ed8936';
                  e.target.style.boxShadow = '0 0 0 4px rgba(237, 137, 54, 0.15)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
              <div style={iconContainerStyle}>
                <DollarSign size={20} />
              </div>
            </div>
          </div>

          {/* Category */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <Tag size={18} color="#48bb78" />
              Category
            </label>
            <div style={inputContainerStyle}>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
                style={selectStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#48bb78';
                  e.target.style.boxShadow = '0 0 0 4px rgba(72, 187, 120, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {getCategoryEmoji(category)} {category}
                  </option>
                ))}
              </select>
              <div style={iconContainerStyle}>
                <Tag size={20} />
              </div>
            </div>
          </div>

          {/* Date */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <Calendar size={18} color="#4299e1" />
              Date
            </label>
            <div style={inputContainerStyle}>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4299e1';
                  e.target.style.boxShadow = '0 0 0 4px rgba(66, 153, 225, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={iconContainerStyle}>
                <Calendar size={20} />
              </div>
            </div>
          </div>

          {/* Note */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <FileText size={18} color="#9f7aea" />
              Description
            </label>
            <div style={inputContainerStyle}>
              <textarea
                placeholder="What did you spend on?"
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                required
                style={textareaStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#9f7aea';
                  e.target.style.boxShadow = '0 0 0 4px rgba(159, 122, 234, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={textareaIconContainerStyle}>
                <FileText size={20} />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={errorStyle}>
              <div style={{
                width: '12px', 
                height: '12px', 
                background: '#c53030', 
                borderRadius: '50%',
                flexShrink: 0
              }}></div>
              {error}
            </div>
          )}

          {/* Buttons */}
          <div style={buttonGroupStyle}>
            <button
              type="button"
              onClick={onClose}
              style={buttonStyle('secondary')}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%)';
                e.currentTarget.style.transform = 'rotate(-0.5deg) translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)';
                e.currentTarget.style.transform = 'rotate(-0.5deg)';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={buttonStyle('primary')}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'rotate(0.5deg) translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(237, 137, 54, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'rotate(0.5deg)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(237, 137, 54, 0.3)';
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '3px solid rgba(255,255,255,0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  {expense ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};