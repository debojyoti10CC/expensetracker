import React, { useState } from 'react';
import { login, register } from '../services/firebase';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name) throw new Error('Name is required');
        await register(email, password, name);
      }
    } catch (err: any) {
      console.error(err);
      let msg = 'Authentication failed';
      
      if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password') msg = 'Invalid email or password.';
      else if (err?.code === 'auth/email-already-in-use') msg = 'Email is already registered.';
      else if (err?.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
      else if (err?.message) msg = err.message;
      else if (typeof err === 'string') msg = err;

      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '"Courier New", monospace'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 98px,
            rgba(255,255,255,0.03) 100px
          ),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 98px,
            rgba(255,255,255,0.03) 100px
          )
        `,
        pointerEvents: 'none'
      }} />

      {/* Main Card */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid #ff006e',
        borderRadius: '0',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: `
          0 0 20px #ff006e,
          inset 0 0 20px rgba(255, 0, 110, 0.1)
        `,
        position: 'relative',
        zIndex: 1
      }}>
        {/* Retro Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            fontSize: '24px',
            color: '#06ffa5',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            textShadow: '0 0 10px #06ffa5',
            marginBottom: '10px'
          }}>
            ExpenseFlow
          </div>
          <div style={{
            fontSize: '12px',
            color: '#8338ec',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            {isLogin ? '>>> Login System <<<' : '>>> Register System <<<'}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#06ffa5',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '5px'
              }}>
                Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required={!isLogin}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: '1px solid #3a86ff',
                  borderRadius: '0',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontFamily: '"Courier New", monospace',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#06ffa5';
                  e.target.style.boxShadow = '0 0 10px #06ffa5';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3a86ff';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#06ffa5',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '5px'
            }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid #3a86ff',
                borderRadius: '0',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: '"Courier New", monospace',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#06ffa5';
                e.target.style.boxShadow = '0 0 10px #06ffa5';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#3a86ff';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#06ffa5',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '5px'
            }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid #3a86ff',
                borderRadius: '0',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: '"Courier New", monospace',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#06ffa5';
                e.target.style.boxShadow = '0 0 10px #06ffa5';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#3a86ff';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(255, 0, 110, 0.2)',
              border: '1px solid #ff006e',
              padding: '10px',
              color: '#ff006e',
              fontSize: '12px',
              marginBottom: '20px',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Error: {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '15px',
              background: isLoading ? 'rgba(131, 56, 236, 0.5)' : '#8338ec',
              border: '2px solid #8338ec',
              borderRadius: '0',
              color: '#ffffff',
              fontSize: '14px',
              fontFamily: '"Courier New", monospace',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isLoading ? 'none' : '0 0 20px #8338ec'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#ff006e';
                e.currentTarget.style.borderColor = '#ff006e';
                e.currentTarget.style.boxShadow = '0 0 30px #ff006e';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#8338ec';
                e.currentTarget.style.borderColor = '#8338ec';
                e.currentTarget.style.boxShadow = '0 0 20px #8338ec';
              }
            }}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        {/* Toggle */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <div style={{
            color: '#3a86ff',
            fontSize: '12px',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </div>
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{
              background: 'transparent',
              border: '1px solid #06ffa5',
              color: '#06ffa5',
              padding: '8px 16px',
              fontSize: '12px',
              fontFamily: '"Courier New", monospace',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#06ffa5';
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.boxShadow = '0 0 15px #06ffa5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#06ffa5';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>

        {/* Retro Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #3a86ff',
          color: '#3a86ff',
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Powered by Firebase • Est. 2024
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 5px currentColor; }
          50% { text-shadow: 0 0 20px currentColor; }
        }
      `}</style>
    </div>
  );
};