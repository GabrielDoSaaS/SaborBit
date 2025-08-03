import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import InputField from '../common/InputField';
import Button from '../common/Button';
import type { Chef } from '../../types/types';
import '../../styles/ProfileSection.css';

const ProfileSection: React.FC<{
  chefData: Chef;
  setChefData: React.Dispatch<React.SetStateAction<Chef>>;
  loading: boolean;
  onUpdateProfile: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  profilePicturePreview: string;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  chefData,
  setChefData,
  loading,
  onUpdateProfile,
  onFileChange,
  profilePicturePreview,
  isEditing,
  setIsEditing
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChefData({ ...chefData, [e.target.name]: e.target.value });
  };

  const isPlanActive = chefData.planoAtivo && (!chefData.dataExpiracaoPlano || new Date(chefData.dataExpiracaoPlano) > new Date());
  const expirationDate = chefData.dataExpiracaoPlano ? new Date(chefData.dataExpiracaoPlano).toLocaleDateString('pt-BR') : 'N/A';

  return (
    <div className="profile-section-container">
      <h2 className="profile-section-heading">Meu Perfil</h2>
      <div className="profile-grid">
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {chefData.profilePicture ? (
              <img src={chefData.profilePicture} alt="Foto de Perfil" className="profile-image" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="profile-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a4 4 0 00-4 4v1a2 2 0 002 2h8a2 2 0 002-2v-1a4 4 0 00-4-4h-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="profile-restaurant-name">{chefData.restaurantName}</p>
          <p className="profile-email">{chefData.email}</p>
        </div>
        <div className="profile-info">
          <p><strong>Nome:</strong> {isEditing ? <InputField label="Nome" name="name" value={chefData.name} onChange={handleChange} /> : chefData.name}</p>
          <p><strong>Telefone:</strong> {isEditing ? <InputField label="Telefone" name="phone" value={chefData.phone} onChange={handleChange} /> : chefData.phone}</p>
          <p><strong>Endereço:</strong> {isEditing ? <InputField label="Endereço" name="address" value={chefData.address} onChange={handleChange} /> : chefData.address}</p>
          <p>
            <strong>Foto de Perfil:</strong>{' '}
            {isEditing ? (
              <InputField
                label="Foto de Perfil"
                type="file"
                name="profilePicture"
                onFileChange={onFileChange}
                filePreview={profilePicturePreview}
              />
            ) : (
              (chefData.profilePicture && <a href={chefData.profilePicture} target="_blank" rel="noopener noreferrer" className="profile-picture-link">Ver Imagem</a>) || 'N/A'
            )}
          </p>
          <p className={`profile-status ${isPlanActive ? 'profile-status-active' : 'profile-status-inactive'}`}>
            Plano Ativo: {isPlanActive ? 'Sim' : 'Não'}
          </p>
          <p className="profile-expiration-date">Data de Expiração: {expirationDate}</p>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <Button onClick={onUpdateProfile} disabled={loading} className="profile-save-btn">
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Button onClick={() => setIsEditing(false)} className="profile-cancel-btn">
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="profile-edit-btn">
                Editar Perfil
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;