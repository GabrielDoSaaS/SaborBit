import React from 'react';
import Button from '../components/common/Button';

interface WelcomePageProps {
  navigate: (path: string) => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ navigate }) => {
  return (
    <div className="welcome-page-container">
      <h1 className="welcome-heading">Bem-vindo ao SaborBIT!</h1>
      <p className="welcome-description">
        A plataforma definitiva para chefs e restaurantes gerenciarem seus cardápios e pedidos online.
      </p>
      <div className="welcome-actions">
        <Button onClick={() => navigate('/login')} className="welcome-btn-login">
          Entrar como Chef
        </Button>
        <Button onClick={() => navigate('/register')} className="welcome-btn-register">
          Quero ser um Chef SaborBIT
        </Button>
      </div>
      <p className="welcome-footer-text">
        Para acessar um cardápio público, utilize a URL fornecida pelo seu chef (ex: /public-menu/ID_DO_CHEF).
      </p>
    </div>
  );
};

export default WelcomePage;