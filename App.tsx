import React, { useState, useEffect } from 'react';
import { subscribeAuth, logout } from './services/firebase';
import { Layout } from './components/Layout';
import { ModernAuthPage } from './pages/ModernAuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExpensesPage } from './pages/ExpensesPage';
import * as api from './services/mockApi';
import { User, Expense } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses'>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Auth Listener
  useEffect(() => {
    const unsubscribe = subscribeAuth(async (authUser) => {
      if (authUser) {
        // Map AuthUser to our App User type
        const mappedUser: User = {
          id: authUser.uid,
          name: authUser.displayName || authUser.email || 'User',
          email: authUser.email || ''
        };
        setUser(mappedUser);
        await loadExpenses(mappedUser.id);
      } else {
        setUser(null);
        setExpenses([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadExpenses = async (userId: string) => {
    try {
      const data = await api.getExpenses(userId);
      setExpenses(data);
    } catch (error) {
      console.error("Failed to load expenses", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setActiveTab('dashboard');
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #ed8936',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <ModernAuthPage />;
  }



  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      <div className="max-w-7xl mx-auto">
        {activeTab === 'dashboard' ? (
          <DashboardPage expenses={expenses} />
        ) : (
          <ExpensesPage 
            userId={user.id} 
            expenses={expenses} 
            onRefresh={() => loadExpenses(user.id)} 
          />
        )}
      </div>
    </Layout>
  );
}

export default App;