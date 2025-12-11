import { Expense, CATEGORIES } from '../../types'

interface ExpenseBentoDashboardProps {
  expenses: Expense[]
}

interface CategoryData {
  category: string
  total: number
}

function PieChart({ categoryData, totalExpenses }: { categoryData: CategoryData[], totalExpenses: number }) {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16']
  const size = 120
  const radius = 50
  const centerX = size / 2
  const centerY = size / 2

  let currentAngle = 0
  const slices = categoryData.map((item, index) => {
    const percentage = item.total / totalExpenses
    const angle = percentage * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle += angle

    // Convert to radians
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    // Calculate arc path
    const x1 = centerX + radius * Math.cos(startRad)
    const y1 = centerY + radius * Math.sin(startRad)
    const x2 = centerX + radius * Math.cos(endRad)
    const y2 = centerY + radius * Math.sin(endRad)

    const largeArcFlag = angle > 180 ? 1 : 0

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')

    return {
      path: pathData,
      color: colors[index % colors.length],
      category: item.category,
      percentage: (percentage * 100).toFixed(1)
    }
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.path}
            fill={slice.color}
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  )
}

export default function ExpenseBentoDashboard({ expenses }: ExpenseBentoDashboardProps) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear
  })
  
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0


  // Category data
  const categoryData = CATEGORIES.map(category => {
    const categoryExpenses = expenses.filter(expense => expense.category === category)
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    return { category, total }
  }).filter(item => item.total > 0)

  // Recent transactions
  const recentExpenses = expenses.slice(0, 5)

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: '#333' }}>
        Expense Dashboard
      </h1>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Total Expenses */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Total Expenses</h3>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
            ${totalExpenses.toFixed(2)}
          </p>
        </div>

        {/* This Month */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>This Month</h3>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
            ${thisMonthTotal.toFixed(2)}
          </p>
        </div>

        {/* Average */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Average per Transaction</h3>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
            ${averageExpense.toFixed(2)}
          </p>
        </div>


      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Categories with Pie Chart */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px' }}>Spending by Category</h3>
          {categoryData.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Simple Pie Chart */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <PieChart categoryData={categoryData} totalExpenses={totalExpenses} />
              </div>
              
              {/* Category Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {categoryData.map((item, index) => {
                  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16']
                  const percentage = ((item.total / totalExpenses) * 100).toFixed(1)
                  return (
                    <div key={item.category} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: colors[index % colors.length],
                        borderRadius: '2px'
                      }} />
                      <span style={{ color: '#666', fontSize: '14px', flex: 1 }}>{item.category}</span>
                      <span style={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>
                        ${item.total.toFixed(2)} ({percentage}%)
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic' }}>No expenses yet</p>
          )}
        </div>

        {/* Recent Transactions */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
          height: '400px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '18px' }}>Recent Transactions</h3>
          {recentExpenses.length > 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              overflowY: 'auto',
              flex: 1,
              paddingRight: '8px'
            }}>
              {expenses.map((expense) => (
                <div key={expense.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f0f0f0',
                  minHeight: '60px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#333', fontSize: '14px', marginBottom: '4px' }}>
                      {expense.note}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      {expense.category} • {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#333', fontSize: '16px', marginLeft: '12px' }}>
                    ${expense.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic' }}>No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  )
}