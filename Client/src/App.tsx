import React, { useState, useEffect } from 'react';
import { AuthContext } from './components/auth/AuthContext';
import Navbar from './components/Navbar';
import MessageModal from './components/common/MessageModal';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashBoardPage';
import PublicMenuPage from './pages/PublicMenuPage';
import WelcomePage from './pages/WelcomePage';
import type { Chef } from './types/types';

const App: React.FC = () => {
  const [chef, setChef] = useState<Chef | null>(() => {
    const savedChef = localStorage.getItem('chef');
    return savedChef ? JSON.parse(savedChef) : null;
  });
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const login = (chefData: Chef) => {
    setChef(chefData);
    localStorage.setItem('chef', JSON.stringify(chefData));
  };

  const logout = () => {
    setChef(null);
    localStorage.removeItem('chef');
    navigate('/login');
    showMessage('Você foi desconectado.', 'info');
  };

  const updateChef = (updatedChefData: Chef) => {
    setChef(updatedChefData);
    localStorage.setItem('chef', JSON.stringify(updatedChefData));
  };

  const showMessage = (msg: string, type: 'success' | 'error' | 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const closeMessageModal = () => {
    setMessage('');
  };

  const renderPage = () => {
    const pathSegments = currentPath.split('/').filter(Boolean);

    switch (pathSegments[0]) {
      case 'register':
        return <RegisterPage navigate={navigate} showMessage={showMessage} />;
      case 'login':
        return <LoginPage navigate={navigate} showMessage={showMessage} />;
      case 'dashboard':
        return <DashboardPage showMessage={showMessage} />;
      case 'public-menu':
        if (pathSegments[1]) {
          return <PublicMenuPage chefId={pathSegments[1]} showMessage={showMessage} />;
        }
        return <div className="page-container"><p className="empty-state-text">URL de cardápio público inválida.</p></div>;
      default:
        return <WelcomePage navigate={navigate} />;
    }
  };

  return (
    <AuthContext.Provider value={{ chef, login, logout, updateChef }}>
      <style>{`
        /* Todos os estilos CSS do original */
      `}</style>
      <Navbar />
      {renderPage()}
      <MessageModal message={message} type={messageType} onClose={closeMessageModal} />
    </AuthContext.Provider>
  );
};

export default App;