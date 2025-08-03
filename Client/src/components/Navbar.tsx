import React from 'react';
import { useAuth } from './auth/AuthContext';
import Button from './common/Button';
import '../styles/Navbar.css'; 

const Navbar: React.FC = () => {
  const { chef, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-brand">
          SaborBIT
        </a>
        <div className="navbar-links">
          {chef ? (
            <>
              <a href="/dashboard" className="navbar-link">Dashboard</a>
              <Button onClick={logout} className="navbar-button-logout">Sair</Button>
            </>
          ) : (
            <>
              <a href="/login" className="navbar-link">Login</a>
              <a href="/register" className="navbar-link-highlight">Registrar</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;