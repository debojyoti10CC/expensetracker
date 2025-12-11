import React, { useState } from 'react';
import { login, register } from '../services/firebase';
import { Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };

  const logoStyle: React.CSSProperties = {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 auto 30px',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const subtitleStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '32px',
    fontSize: '16px'
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: '20px'
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  };

  const inputContainerStyle: React.CSSProperties = {
    position: 'relative'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 16px 16px 48px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.2s ease',
    background: '#f9fafb',
    boxSizing: 'border-box'
  };

  const inputFocusStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: '#667eea',
    background: '#ffffff',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    pointerEvents: 'none'
  };

  const eyeIconStyle: React.CSSProperties = {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '4px'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '8px'
  };

  const buttonHoverStyle: React.CSSProperties = {
    ...buttonStyle,
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
  };

  const errorStyle: React.CSSProperties = {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    padding: '12px',
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const toggleStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '24px'
  };

  const toggleButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#667eea',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '14px'
  };

  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb',
    fontSize: '12px',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoStyle}>K</div>
        
        <h1 style={titleStyle}>
          {isLogin ? 'Welcome Back' : 'Join K.E.C Serv'}
        </h1>
        <p style={subtitleStyle}>
          {isLogin ? 'Sign in to your account' : 'Create your account today'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                <User size={16} color="#667eea" />
                Full Name
              </label>
              <div style={inputContainerStyle}>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required={!isLogin}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
                <User size={20} style={iconStyle} />
              </div>
            </div>
          )}

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <Mail size={16} color="#667eea" />
              Email Address
            </label>
            <div style={inputContainerStyle}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
              <Mail size={20} style={iconStyle} />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              <Lock size={16} color="#667eea" />
              Password
            </label>
            <div style={inputContainerStyle}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{...inputStyle, paddingRight: '48px'}}
                onFocus={(e) => Object.assign(e.target.style, {...inputFocusStyle, paddingRight: '48px'})}
                onBlur={(e) => Object.assign(e.target.style, {...inputStyle, paddingRight: '48px'})}
              />
              <Lock size={20} style={iconStyle} />
              <div
                style={eyeIconStyle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          {error && (
            <div style={errorStyle}>
              <div style={{width: '8px', height: '8px', background: '#dc2626', borderRadius: '50%'}}></div>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={buttonStyle}
            onMouseEnter={(e) => !isLoading && Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Processing...
              </>
            ) : (
              <>
                <Shield size={20} />
                {isLogin ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        <div style={toggleStyle}>
          <p style={{color: '#6b7280', marginBottom: '8px'}}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={toggleButtonStyle}
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        <div style={footerStyle}>
          <Shield size={12} />
          Secured by Firebase Authentication
        </div>
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