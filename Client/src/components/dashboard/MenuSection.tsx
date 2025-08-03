import React, { useState } from 'react';
import type { MenuItem } from '../../types/types';
import Button from '../common/Button';
import InputField from '../common/InputField';
import './MenuSection.css';

interface MenuSectionProps {
  menuItems: MenuItem[];
  loading: boolean;
  onAddOrUpdateItem: (e: React.FormEvent) => void;
  onDeleteItem: (itemId: string) => void;
  menuItemForm: {
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
  };
  setMenuItemForm: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
  }>>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  menuItemImagePreview: string;
  currentMenuItem: MenuItem | null;
  setCurrentMenuItem: React.Dispatch<React.SetStateAction<MenuItem | null>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  loading,
  onAddOrUpdateItem,
  onDeleteItem,
  menuItemForm,
  setMenuItemForm,
  onFileChange,
  menuItemImagePreview,
  currentMenuItem,
  setCurrentMenuItem,
  showModal,
  setShowModal
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenuItemForm({ ...menuItemForm, [e.target.name]: e.target.value });
  };

  const openModal = (item: MenuItem | null = null) => {
    setCurrentMenuItem(item);
    if (item) {
      setMenuItemForm({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        imageUrl: item.imageUrl || ''
      });
    } else {
      setMenuItemForm({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: ''
      });
    }
    setShowModal(true);
  };

  return (
    <div className="menu-section-container">
      <h2 className="menu-section-heading">Gerenciar Cardápio</h2>
      <Button onClick={() => openModal()} className="add-item-btn">
        Adicionar Novo Item
      </Button>

      {loading ? (
        <p className="loading-text">Carregando itens do cardápio...</p>
      ) : menuItems.length === 0 ? (
        <p className="empty-state-text">Nenhum item no cardápio ainda. Adicione um!</p>
      ) : (
        <div className="menu-grid">
          {menuItems.map((item) => (
            <div key={item._id} className="menu-item-card">
              <div>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="menu-item-image" />
                ) : (
                  <div className="menu-item-image-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" className="menu-item-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 3 3 5-5V15z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="menu-item-details">
                  <h3 className="menu-item-name">{item.name}</h3>
                  <p className="menu-item-description">{item.description}</p>
                  <p className="menu-item-price">R$ {item.price.toFixed(2)}</p>
                  <p className="menu-item-category">Categoria: {item.category}</p>
                </div>
              </div>
              <div className="menu-item-actions">
                <Button onClick={() => openModal(item)} className="edit-btn">
                  Editar
                </Button>
                <Button onClick={() => onDeleteItem(item._id)} className="delete-btn">
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-heading">
              {currentMenuItem ? 'Editar Item do Cardápio' : 'Adicionar Novo Item'}
            </h3>
            <form onSubmit={onAddOrUpdateItem}>
              <InputField label="Nome" name="name" value={menuItemForm.name} onChange={handleChange} required />
              <InputField label="Descrição" name="description" value={menuItemForm.description} onChange={handleChange} />
              <InputField label="Preço" type="number" name="price" value={menuItemForm.price} onChange={handleChange} required />
              <InputField label="Categoria" name="category" value={menuItemForm.category} onChange={handleChange} />
              <InputField
                label="Imagem do Item (Opcional)"
                type="file"
                name="imageUrl"
                onFileChange={onFileChange}
                filePreview={menuItemImagePreview}
              />
              <div className="modal-actions">
                <Button type="button" onClick={() => setShowModal(false)} className="modal-cancel-btn">
                  Cancelar
                </Button>
                <Button type="submit" className="modal-submit-btn" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuSection;