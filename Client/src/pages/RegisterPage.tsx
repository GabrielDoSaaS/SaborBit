import React, { useState } from 'react';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import '../styles/RegisterPage.css'; 

interface RegisterPageProps {
  navigate: (path: string) => void;
  showMessage: (message: string, type: 'success' | 'error' | 'info') => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ navigate, showMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    restaurantName: '',
    profilePicture: ''
  });
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result as string });
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, profilePicture: '' });
      setProfilePicturePreview('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://backend-saborbit.onrender.com/api/beAChef', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage(data.message, 'success');
        navigate('/login');
      } else {
        showMessage(data.message || 'Erro ao registrar chef.', 'error');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      showMessage('Erro de rede. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card">
        <h2 className="register-title">Registrar Chef</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <InputField
            label="Nome Completo"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome"
            required
          />
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
          <InputField
            label="Telefone (WhatsApp)"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Ex: 5511999998888"
            required
          />
          <InputField
            label="Endereço"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Rua, número, bairro, cidade"
            required
          />
          <InputField
            label="Nome do Restaurante"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleChange}
            placeholder="Nome do seu estabelecimento"
            required
          />
          <InputField
            label="Foto de Perfil (Opcional)"
            type="file"
            name="profilePicture"
            onFileChange={handleFileChange}
            filePreview={profilePicturePreview}
          />
          <Button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>
        <p className="register-footer-text">
          Já tem uma conta? <a href="/login" className="register-link">Faça Login aqui</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;