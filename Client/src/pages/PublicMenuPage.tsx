import React, { useState, useEffect } from 'react';
import type { Chef, MenuItem, CartItem } from '../types/types';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';

interface PublicMenuPageProps {
  chefId: string;
  showMessage: (message: string, type: 'success' | 'error' | 'info') => void;
}

const PublicMenuPage: React.FC<PublicMenuPageProps> = ({ chefId, showMessage }) => {
  const [chefInfo, setChefInfo] = useState<Chef | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    observations: '',
  });
  const [orderLoading, setOrderLoading] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');

  useEffect(() => {
    const fetchPublicMenuData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch chef info
        const chefResponse = await fetch(`https://backend-saborbit.onrender.com/api/public/menu/${chefId}`);
        const chefData = await chefResponse.json();
        if (!chefResponse.ok) {
          throw new Error(chefData.message || 'Erro ao buscar informações do restaurante.');
        }
        setChefInfo(chefData);

        // Fetch menu items
        const menuResponse = await fetch(`https://backend-saborbit.onrender.com/api/public/menu/${chefId}/items`);
        const menuData = await menuResponse.json();
        if (!menuResponse.ok) {
          throw new Error(menuData.message || 'Erro ao buscar itens do cardápio.');
        }
        setMenuItems(menuData.menuItems);

      } catch (err) {
        console.error('Erro ao carregar cardápio público:', err);
        if (err instanceof Error) {
          setError(err.message || 'Não foi possível carregar o cardápio. O restaurante pode estar inativo ou não existe.');
        } else {
          setError('Não foi possível carregar o cardápio. O restaurante pode estar inativo ou não existe.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (chefId) {
      fetchPublicMenuData();
    }
  }, [chefId]);

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.menuItemId === item._id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.menuItemId === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...prevCart, { 
          menuItemId: item._id, 
          name: item.name, 
          price: item.price, 
          quantity: 1, 
          observations: '' 
        }];
      }
    });
    showMessage(`${item.name} adicionado ao carrinho!`, 'success');
  };

  const updateCartItemQuantity = (menuItemId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.menuItemId === menuItemId ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const updateCartItemObservations = (menuItemId: string, observations: string) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.menuItemId === menuItemId ? { ...item, observations } : item))
    );
  };

  const removeFromCart = (menuItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.menuItemId !== menuItemId));
    showMessage('Item removido do carrinho.', 'info');
  };

  const getTotalCartPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleOrderFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderFormData({ ...orderFormData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderLoading(true);
    setWhatsappLink(''); // Reset link
    try {
      const orderItems = cart.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        observations: item.observations,
      }));

      const payload = {
        chefId: chefId,
        items: orderItems,
        clientName: orderFormData.clientName,
        clientPhone: orderFormData.clientPhone,
        clientAddress: orderFormData.clientAddress,
        observations: orderFormData.observations,
      };

      const response = await fetch('https://backend-saborbit.onrender.com/api/public/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        showMessage('Pedido realizado com sucesso!', 'success');
        setWhatsappLink(data.whatsappUrl);
        setCart([]); // Limpa o carrinho
        setShowOrderForm(false);
        setOrderFormData({ clientName: '', clientPhone: '', clientAddress: '', observations: '' });
      } else {
        showMessage(data.message || 'Erro ao realizar pedido.', 'error');
      }
    } catch (error) {
      console.error('Erro de rede ao fazer pedido:', error);
      showMessage('Erro de rede. Tente novamente.', 'error');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p className="loading-text">Carregando cardápio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page-container">
        <div className="error-card">
          <h2 className="error-heading">Erro ao Carregar Cardápio</h2>
          <p className="error-message">{error}</p>
          <p className="error-suggestion">Por favor, verifique o link ou tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  if (!chefInfo) {
    return (
      <div className="page-container">
        <p className="loading-text">Chef/Restaurante não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="public-menu-page">
      <header className="public-header">
        <h1 className="public-restaurant-name">{chefInfo.restaurantName}</h1>
        <p className="public-address">{chefInfo.address}</p>
        <p className="public-phone">Telefone: {chefInfo.phone}</p>
        {chefInfo.profilePicture && (
          <img src={chefInfo.profilePicture} alt="Logo do Restaurante" className="public-logo" />
        )}
      </header>

      <main className="public-main-grid">
        <section className="public-menu-section">
          <h2 className="public-section-heading">Nosso Cardápio</h2>
          {menuItems.length === 0 ? (
            <p className="empty-state-text">Nenhum item disponível no cardápio no momento.</p>
          ) : (
            <div className="public-menu-grid">
              {menuItems.map((item) => (
                <div key={item._id} className="public-menu-item">
                  <div>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="public-menu-item-image" />
                    ) : (
                      <div className="public-menu-item-image-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" className="public-menu-item-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 3 3 5-5V15z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <h3 className="public-menu-item-name">{item.name}</h3>
                    <p className="public-menu-item-description">{item.description}</p>
                    <p className="public-menu-item-price">R$ {item.price.toFixed(2)}</p>
                    <p className="public-menu-item-category">Categoria: {item.category}</p>
                  </div>
                  <Button onClick={() => addToCart(item)} className="public-add-to-cart-btn">
                    Adicionar ao Carrinho
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="public-cart-aside">
          <h2 className="public-cart-heading">Seu Pedido</h2>
          {cart.length === 0 ? (
            <p className="empty-state-text">Seu carrinho está vazio.</p>
          ) : (
            <>
              <ul className="cart-items-list">
                {cart.map((item) => (
                  <li key={item.menuItemId} className="cart-item">
                    <div className="cart-item-details">
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-price">R$ {item.price.toFixed(2)} x {item.quantity}</p>
                      <InputField
                        label="Observações"
                        name={`observations-${item.menuItemId}`}
                        type="text"
                        placeholder="Observações do item (ex: sem cebola)"
                        value={item.observations}
                        onChange={(e) => updateCartItemObservations(item.menuItemId, e.target.value)}
                        className="cart-item-observations-input"
                      />
                    </div>
                    <div className="cart-item-controls">
                      <button
                        onClick={() => updateCartItemQuantity(item.menuItemId, item.quantity - 1)}
                        className="cart-control-btn cart-control-btn-minus"
                      >
                        -
                      </button>
                      <span className="cart-item-quantity">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItemQuantity(item.menuItemId, item.quantity + 1)}
                        className="cart-control-btn cart-control-btn-plus"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.menuItemId)}
                        className="cart-control-btn cart-control-btn-remove"
                      >
                        &times;
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                Total: R$ {getTotalCartPrice().toFixed(2)}
              </div>
              <Button onClick={() => setShowOrderForm(true)} className="public-checkout-btn">
                Finalizar Pedido
              </Button>
            </>
          )}

          {showOrderForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 className="modal-heading">Seus Dados para o Pedido</h3>
                <form onSubmit={handlePlaceOrder}>
                  <InputField label="Seu Nome" name="clientName" value={orderFormData.clientName} onChange={handleOrderFormChange} required />
                  <InputField label="Seu Telefone (WhatsApp)" name="clientPhone" value={orderFormData.clientPhone} onChange={handleOrderFormChange} placeholder="Ex: 5511999998888" required />
                  <InputField label="Seu Endereço (Opcional)" name="clientAddress" value={orderFormData.clientAddress} onChange={handleOrderFormChange} placeholder="Rua, número, bairro, cidade" />
                  <InputField label="Observações Gerais do Pedido (Opcional)" name="observations" value={orderFormData.observations} onChange={handleOrderFormChange} />
                  <div className="modal-actions">
                    <Button type="button" onClick={() => setShowOrderForm(false)} className="btn-gray">
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={orderLoading}>
                      {orderLoading ? 'Enviando...' : 'Enviar Pedido'}
                    </Button>
                  </div>
                </form>
                {whatsappLink && (
                  <div className="whatsapp-link-container">
                    <p className="whatsapp-link-text">Pedido enviado! Clique para abrir no WhatsApp:</p>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                      Abrir WhatsApp com o Pedido
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
};

export default PublicMenuPage;