import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import TabButton from '../components/common/TabButton';
import ProfileSection from '../components/dashboard/ProfileSection';
import MenuSection from '../components/dashboard/MenuSection';
import OrdersSection from '../components/dashboard/OrdersSection';
import QrSection from '../components/dashboard/QrSection';
import PlansSection from '../components/dashboard/PlansSection';
import type { Chef, MenuItem, Order } from '../types/types';
import '../styles/DashboardPage.css'; 

const DashboardPage: React.FC<{ showMessage: (message: string, type: 'success' | 'error' | 'info') => void }> = ({ showMessage }) => {
  const { chef, updateChef } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'menu' | 'orders' | 'qr' | 'plans'>('profile');
  const [loading, setLoading] = useState(false);

  const [chefData, setChefData] = useState<Chef>(chef!);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState(chef?.profilePicture || '');

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showMenuItemModal, setShowMenuItemModal] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItem | null>(null);
  const [menuItemForm, setMenuItemForm] = useState({
    name: '', description: '', price: '', category: '', imageUrl: ''
  });
  const [menuItemImagePreview, setMenuItemImagePreview] = useState('');

  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    if (!chef) return;
    setChefData(chef);
    setProfilePicturePreview(chef.profilePicture || '');

    if (activeTab === 'menu') {
      fetchMenuItems();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [chef, activeTab]);

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChefData({ ...chefData, profilePicture: reader.result as string });
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://backend-saborbit.onrender.com/api/chefs/${chef?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chefData),
      });
      const data = await response.json();
      if (response.ok) {
        updateChef(data.chef);
        showMessage(data.message, 'success');
        setIsEditingProfile(false);
      } else {
        showMessage(data.message || 'Erro ao atualizar perfil.', 'error');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      showMessage('Erro de rede. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://backend-saborbit.onrender.com/api/chefs/${chef?._id}/menuItems`);
      const data = await response.json();
      if (response.ok) {
        setMenuItems(data.menuItems);
      } else {
        setMenuItems([]);
        showMessage(data.message || 'Nenhum item de cardápio encontrado.', 'info');
      }
    } catch (error) {
      console.error('Erro ao buscar itens do cardápio:', error);
      showMessage('Erro ao buscar itens do cardápio.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuItemFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuItemForm({ ...menuItemForm, imageUrl: reader.result as string });
        setMenuItemImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrUpdateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = currentMenuItem
      ? `https://backend-saborbit.onrender.com/api/menuItems/${currentMenuItem._id}`
      : `https://backend-saborbit.onrender.com/api/chefs/${chef?._id}/menuItems`;
    const method = currentMenuItem ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...menuItemForm,
          price: parseFloat(menuItemForm.price),
          chefId: chef?._id
        }),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage(data.message, 'success');
        fetchMenuItems();
        setShowMenuItemModal(false);
        setMenuItemForm({ name: '', description: '', price: '', category: '', imageUrl: '' });
        setCurrentMenuItem(null);
        setMenuItemImagePreview('');
      } else {
        showMessage(data.message || 'Erro ao salvar item do cardápio.', 'error');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      showMessage('Erro de rede. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
    setLoading(true);
    try {
      const response = await fetch(`https://backend-saborbit.onrender.com/api/menuItems/${itemId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        showMessage(data.message, 'success');
        fetchMenuItems();
      } else {
        showMessage(data.message || 'Erro ao excluir item do cardápio.', 'error');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      showMessage('Erro de rede. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://saborbit.onrender.com/api/chefs/${chef?._id}/orders`);
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders);
      } else {
        setOrders([]);
        showMessage(data.message || 'Nenhum pedido encontrado.', 'info');
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      showMessage('Erro ao buscar pedidos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: 'pending' | 'preparing' | 'delivered') => {
    setLoading(true);
    try {
      const response = await fetch(`https://backend-saborbit.onrender.com/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage(data.message, 'success');
        fetchOrders();
      } else {
        showMessage(data.message || 'Erro ao atualizar status do pedido.', 'error');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      showMessage('Erro de rede. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openOrderDetailsModal = (order: Order) => {
    setCurrentOrder(order);
    setShowOrderModal(true);
  };

  const generateQrCode = async () => {
    setQrLoading(true);
    const publicMenuUrl = `${window.location.origin}/public-menu/${chef?._id}`;
    try {
      const response = await fetch('https://backend-saborbit.onrender.com/api/generate-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: publicMenuUrl }),
      });
      const data = await response.json();
      if (response.ok) {
        setQrCodeUrl(data.qrCodeUrl);
        showMessage('QR Code gerado com sucesso!', 'success');
      } else {
        showMessage(data.message || 'Erro ao gerar QR Code.', 'error');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      showMessage('Erro de rede. Tente novamente.', 'error');
    } finally {
      setQrLoading(false);
    }
  };

  const handleSubscribe = async (planType: 'mensal' | 'anual') => {
    setLoading(true);
    try {
      const endpoint = planType === 'mensal' ? '/planMensal' : '/planAnual';
      const response = await fetch(`https://backend-saborbit.onrender.com/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailChef: chef?.email }),
      });
      const redirectUrl = await response.text();
      if (response.ok) {
        window.location.href = redirectUrl;
      } else {
        const errorData = await response.json();
        showMessage(errorData.message || `Erro ao assinar plano ${planType}.`, 'error');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      showMessage('Erro de rede. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!chef) {
    return (
      <div className="dashboard-loading-container">
        <p className="dashboard-loading-text">Você precisa estar logado para acessar o Dashboard.</p>
      </div>
    );
  }

  function setIsEditing(value: React.SetStateAction<boolean>): void {
    setIsEditingProfile(value);
  }

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h1 className="dashboard-heading">Dashboard do Chef</h1>

        <div className="dashboard-card">
          <div className="tab-buttons-container">
            <TabButton label="Perfil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <TabButton label="Cardápio" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
            <TabButton label="Pedidos" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
            <TabButton label="QR Code" active={activeTab === 'qr'} onClick={() => setActiveTab('qr')} />
            <TabButton label="Planos" active={activeTab === 'plans'} onClick={() => setActiveTab('plans')} />
          </div>

          <div className="tab-content">
            {activeTab === 'profile' && (
              <ProfileSection
                chefData={chefData}
                setChefData={setChefData}
                loading={loading}
                onUpdateProfile={handleUpdateProfile}
                onFileChange={handleProfileFileChange}
                profilePicturePreview={profilePicturePreview}
                isEditing={isEditingProfile}
                setIsEditing={setIsEditing}
              />
            )}

            {activeTab === 'menu' && (
              <MenuSection
                menuItems={menuItems}
                loading={loading}
                onAddOrUpdateItem={handleAddOrUpdateMenuItem}
                onDeleteItem={handleDeleteMenuItem}
                menuItemForm={menuItemForm}
                setMenuItemForm={setMenuItemForm}
                onFileChange={handleMenuItemFileChange}
                menuItemImagePreview={menuItemImagePreview}
                currentMenuItem={currentMenuItem}
                setCurrentMenuItem={setCurrentMenuItem}
                showModal={showMenuItemModal}
                setShowModal={setShowMenuItemModal}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersSection
                orders={orders}
                loading={loading}
                onUpdateStatus={handleUpdateOrderStatus}
                onViewDetails={openOrderDetailsModal}
                currentOrder={currentOrder}
                showModal={showOrderModal}
                setShowModal={setShowOrderModal}
              />
            )}

            {activeTab === 'qr' && (
              <QrSection
                qrCodeUrl={qrCodeUrl}
                loading={qrLoading}
                chefId={chef._id}
                onGenerateQr={generateQrCode}
              />
            )}

            {activeTab === 'plans' && (
              <PlansSection
                chefData={chefData}
                loading={loading}
                onSubscribe={handleSubscribe}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;