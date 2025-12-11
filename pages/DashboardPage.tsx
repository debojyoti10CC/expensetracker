import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, CreditCard, Target, ArrowUpRight, ArrowDownRight, Zap, Eye } from 'lucide-react';
import { Expense, Category, CATEGORIES } from '../types';

interface DashboardPageProps {
  expenses: Expense[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ expenses }) => {
  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto'
  };

  // Unique asymmetric header
  const headerSectionStyle: React.CSSProperties = {
    marginBottom: '48px',
    position: 'relative'
  };

  const headerContentStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    borderRadius: '24px',
    padding: '40px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    transform: 'rotate(-1deg)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
  };

  const headerDecorStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '200px',
    height: '200px',
    background: 'linear-gradient(45deg, rgba(237, 137, 54, 0.2), rgba(221, 107, 32, 0.1))',
    borderRadius: '50% 30% 70% 40%',
    transform: 'rotate(25deg)'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '42px',
    fontWeight: '800',
    marginBottom: '12px',
    letterSpacing: '-1px',
    transform: 'rotate(1deg)'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '18px',
    opacity: 0.8,
    transform: 'rotate(1deg)'
  };

  // Creative stats grid with different shapes
  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '48px'
  };

  const createStatCardStyle = (rotation: string, gradient: string): React.CSSProperties => ({
    background: `linear-gradient(135deg, ${gradient})`,
    borderRadius: '20px',
    padding: '32px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    transform: rotation,
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  });

  const statIconContainerStyle: React.CSSProperties = {
    width: '64px',
    height: '64px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    backdropFilter: 'blur(10px)'
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '8px',
    letterSpacing: '-0.5px'
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '16px',
    opacity: 0.9,
    fontWeight: '500'
  };

  // Unique chart containers with organic shapes
  const chartsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
    marginBottom: '48px'
  };

  const chartCardStyle = (shape: string): React.CSSProperties => ({
    background: 'white',
    borderRadius: shape === 'organic' ? '30px 10px 30px 10px' : '20px',
    padding: '32px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    position: 'relative',
    overflow: 'hidden'
  });

  const chartTitleStyle: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
  });
  
  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
  });

  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyChange = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  // Category data for pie chart
  const categoryData = CATEGORIES.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      name: category,
      value: total,
      count: categoryExpenses.length
    };
  }).filter(item => item.value > 0);

  // Weekly data for line chart
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.toDateString() === date.toDateString();
    });
    return {
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      amount: dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    };
  });

  const COLORS = ['#ed8936', '#48bb78', '#4299e1', '#9f7aea', '#f56565', '#38b2ac'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(26, 32, 44, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: '16px 20px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white'
        }}>
          <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{label}</p>
          <p style={{ margin: '8px 0 0 0', color: '#ed8936', fontSize: '16px', fontWeight: '700' }}>
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={containerStyle}>
      {/* Creative Header */}
      <div style={headerSectionStyle}>
        <div style={headerContentStyle}>
          <div style={headerDecorStyle} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 style={titleStyle}>Financial Overview</h1>
            <p style={subtitleStyle}>
              Track your spending patterns and financial health
            </p>
          </div>
        </div>
      </div>

      {/* Creative Stats Cards */}
      <div style={statsGridStyle}>
        <div 
          style={createStatCardStyle('rotate(1deg)', '#ed8936, #dd6b20')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(1deg) translateY(-8px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(1deg)';
          }}
        >
          <div style={statIconContainerStyle}>
            <DollarSign size={32} />
          </div>
          <div style={statValueStyle}>${totalExpenses.toFixed(2)}</div>
          <div style={statLabelStyle}>Total Spent</div>
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            right: '-30px',
            width: '100px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%'
          }} />
        </div>

        <div 
          style={createStatCardStyle('rotate(-1deg)', '#48bb78, #38a169')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(-1deg) translateY(-8px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(-1deg)';
          }}
        >
          <div style={statIconContainerStyle}>
            <Calendar size={32} />
          </div>
          <div style={statValueStyle}>${thisMonthTotal.toFixed(2)}</div>
          <div style={statLabelStyle}>This Month</div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {monthlyChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(monthlyChange).toFixed(1)}% vs last month
          </div>
        </div>

        <div 
          style={createStatCardStyle('rotate(0.5deg)', '#4299e1, #3182ce')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(0.5deg) translateY(-8px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(0.5deg)';
          }}
        >
          <div style={statIconContainerStyle}>
            <Target size={32} />
          </div>
          <div style={statValueStyle}>${averageExpense.toFixed(2)}</div>
          <div style={statLabelStyle}>Average Transaction</div>
        </div>

        <div 
          style={createStatCardStyle('rotate(-0.5deg)', '#9f7aea, #805ad5')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(-0.5deg) translateY(-8px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(-0.5deg)';
          }}
        >
          <div style={statIconContainerStyle}>
            <Zap size={32} />
          </div>
          <div style={statValueStyle}>{expenses.length}</div>
          <div style={statLabelStyle}>Total Transactions</div>
        </div>
      </div>

      {/* Creative Charts Section */}
      <div style={chartsContainerStyle}>
        {/* Category Breakdown */}
        <div style={chartCardStyle('organic')}>
          <h3 style={chartTitleStyle}>
            <Eye size={24} color="#ed8936" />
            Spending Breakdown
          </h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{
              height: '320px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a0aec0',
              fontSize: '16px'
            }}>
              No spending data yet
            </div>
          )}
        </div>

        {/* Weekly Trend */}
        <div style={chartCardStyle('normal')}>
          <h3 style={chartTitleStyle}>
            <TrendingUp size={24} color="#48bb78" />
            Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#48bb78" 
                strokeWidth={3}
                dot={{ fill: '#48bb78', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#48bb78', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity with Creative Layout */}
      {expenses.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          transform: 'rotate(-0.5deg)'
        }}>
          <h3 style={{
            ...chartTitleStyle,
            transform: 'rotate(0.5deg)'
          }}>
            <CreditCard size={24} color="#9f7aea" />
            Recent Activity
          </h3>
          <div style={{ transform: 'rotate(0.5deg)' }}>
            {expenses.slice(0, 5).map((expense, index) => (
              <div
                key={expense.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 0',
                  borderBottom: index < 4 ? '1px solid #f7fafc' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${COLORS[CATEGORIES.indexOf(expense.category)]}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {expense.category === 'Food' ? '🍽️' : 
                     expense.category === 'Transport' ? '🚗' :
                     expense.category === 'Utilities' ? '⚡' :
                     expense.category === 'Entertainment' ? '🎬' :
                     expense.category === 'Health' ? '🏥' :
                     expense.category === 'Education' ? '📚' : '📦'}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>
                      {expense.note}
                    </div>
                    <div style={{ fontSize: '14px', color: '#718096' }}>
                      {new Date(expense.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })} • {expense.category}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1a202c'
                }}>
                  ${expense.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};