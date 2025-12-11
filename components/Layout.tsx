import React from 'react';
import { LayoutDashboard, Receipt, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  activeTab: 'dashboard' | 'expenses';
  onTabChange: (tab: 'dashboard' | 'expenses') => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, activeTab, onTabChange, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#fafbfc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative'
  };

  // Unique asymmetric header design
  const headerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #2d3748 100%)',
    position: 'relative',
    overflow: 'hidden'
  };

  const headerContentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 10,
    padding: '20px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  // Decorative elements for header
  const decorativeShapeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '200px',
    height: '200px',
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
    borderRadius: '50%',
    transform: 'rotate(15deg)'
  };

  const logoContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const logoStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    boxShadow: '0 8px 20px rgba(237, 137, 54, 0.3)',
    transform: 'rotate(-3deg)'
  };

  const brandTextStyle: React.CSSProperties = {
    color: 'white',
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.5px'
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '8px',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)'
  };

  const navItemStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: '12px',
    background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    transform: isActive ? 'translateY(-1px)' : 'none'
  });

  const userSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const userCardStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const avatarStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)'
  };

  const logoutButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: 'rgba(245, 101, 101, 0.2)',
    color: 'white',
    border: '1px solid rgba(245, 101, 101, 0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  };

  const mobileMenuButtonStyle: React.CSSProperties = {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    color: 'white'
  };

  // Unique main content area with organic shapes
  const mainContentStyle: React.CSSProperties = {
    padding: '40px 32px',
    position: 'relative',
    minHeight: 'calc(100vh - 100px)'
  };

  const backgroundShapesStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 1
  };

  const mobileMenuStyle: React.CSSProperties = {
    position: 'fixed',
    top: '100px',
    left: 0,
    right: 0,
    background: 'rgba(45, 55, 72, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '24px 32px',
    display: isMobileMenuOpen ? 'flex' : 'none',
    flexDirection: 'column',
    gap: '16px',
    zIndex: 50,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const NavItem = ({ tab, label, icon: Icon }: { tab: 'dashboard' | 'expenses'; label: string; icon: any }) => (
    <button
      onClick={() => {
        onTabChange(tab);
        setIsMobileMenuOpen(false);
      }}
      style={navItemStyle(activeTab === tab)}
      onMouseEnter={(e) => {
        if (activeTab !== tab) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (activeTab !== tab) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.transform = 'none';
        }
      }}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  // Organic background shapes
  const BackgroundShapes = () => (
    <div style={backgroundShapesStyle}>
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: '300px',
        height: '300px',
        background: 'linear-gradient(135deg, rgba(237, 137, 54, 0.05), rgba(221, 107, 32, 0.02))',
        borderRadius: '50% 30% 70% 40%',
        transform: 'rotate(25deg)',
        animation: 'float 20s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '8%',
        width: '200px',
        height: '200px',
        background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.05), rgba(56, 161, 105, 0.02))',
        borderRadius: '30% 70% 50% 30%',
        transform: 'rotate(-15deg)',
        animation: 'float 25s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '150px',
        height: '150px',
        background: 'linear-gradient(135deg, rgba(66, 153, 225, 0.03), rgba(49, 130, 206, 0.01))',
        borderRadius: '40% 60% 30% 70%',
        transform: 'translate(-50%, -50%) rotate(45deg)',
        animation: 'float 30s ease-in-out infinite'
      }} />
    </div>
  );

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(5deg); }
          66% { transform: translateY(10px) rotate(-3deg); }
        }
        @media (max-width: 768px) {
          .mobile-menu-button { display: flex !important; }
          .desktop-nav { display: none !important; }
          .desktop-user { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <header style={headerStyle}>
        <div style={decorativeShapeStyle} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '20%',
          width: '100px',
          height: '100px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '30% 70% 50% 30%',
          transform: 'rotate(-20deg)'
        }} />
        
        <div style={headerContentStyle}>
          {/* Logo */}
          <div style={logoContainerStyle}>
            <div style={logoStyle}>
              <Sparkles size={24} />
            </div>
            <div style={brandTextStyle}>ExpenseFlow</div>
          </div>

          {/* Desktop Navigation */}
          <nav style={navStyle} className="desktop-nav">
            <NavItem tab="dashboard" label="Overview" icon={LayoutDashboard} />
            <NavItem tab="expenses" label="Transactions" icon={Receipt} />
          </nav>

          {/* Desktop User Section */}
          <div style={userSectionStyle} className="desktop-user">
            <div style={userCardStyle}>
              <div style={avatarStyle}>
                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
                  {user.displayName || 'User'}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  {user.email}
                </div>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              style={logoutButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(245, 101, 101, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(245, 101, 101, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={mobileMenuButtonStyle}
            className="mobile-menu-button"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div style={mobileMenuStyle} className="mobile-menu">
        <NavItem tab="dashboard" label="Overview" icon={LayoutDashboard} />
        <NavItem tab="expenses" label="Transactions" icon={Receipt} />
        
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px', marginTop: '20px' }}>
          <div style={userCardStyle}>
            <div style={avatarStyle}>
              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>
                {user.displayName || 'User'}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                {user.email}
              </div>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            style={{ ...logoutButtonStyle, width: '100%', justifyContent: 'center', marginTop: '16px' }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main style={mainContentStyle}>
        <BackgroundShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </main>
    </div>
  );
};