import React from 'react';
import { Expense } from '../types';
import ExpenseBentoDashboard from '../components/ui/expense-bento-dashboard';

interface DashboardPageProps {
  expenses: Expense[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ expenses }) => {
  const containerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px'
  };

  const backgroundStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
    borderRadius: '32px',
    padding: '40px',
    minHeight: '80vh',
    position: 'relative',
    overflow: 'hidden'
  };

  const decorativeElementsStyle: React.CSSProperties = {
    position: 'absolute',
    inset: '0',
    overflow: 'hidden',
    pointerEvents: 'none'
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle}>
        {/* Decorative background elements */}
        <div style={decorativeElementsStyle}>
          <div style={{
            position: 'absolute',
            top: '-200px',
            right: '-200px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(240, 147, 251, 0.05) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
        </div>

        {/* Bento Grid Dashboard */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <ExpenseBentoDashboard expenses={expenses} />
        </div>
      </div>
    </div>
  );
};