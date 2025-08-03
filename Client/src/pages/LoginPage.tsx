import React, { useState } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import '../styles/LoginPage.css';

interface LoginPageProps {
  navigate: (path: string) => void;
  showMessage: (message: string, type: 'success' | 'error' | 'info') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigate, showMessage }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://backend-saborbit.onrender.com/api/loginChef', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.chef);
        showMessage(data.message, 'success');
        navigate('/dashboard');
      } else {
        showMessage(data.message || 'Erro ao fazer login.', 'error');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      showMessage('Erro de rede. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h2 className="login-title">Login Chef</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
          />
          <InputField
            label="Senha"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            required
          />
          <Button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <p className="login-footer-text">
          Não tem uma conta? <a href="/register" className="login-link">Registre-se aqui</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;