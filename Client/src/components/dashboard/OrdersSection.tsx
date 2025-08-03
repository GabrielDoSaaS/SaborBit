import React from 'react';
import type { Order } from '../../types/types';
import Button from '../common/Button';

interface OrdersSectionProps {
  orders: Order[];
  loading: boolean;
  onUpdateStatus: (orderId: string, newStatus: 'pending' | 'preparing' | 'delivered') => void;
  onViewDetails: (order: Order) => void;
  currentOrder: Order | null;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders,
  loading,
  onUpdateStatus,
  onViewDetails,
  currentOrder,
  showModal,
  setShowModal
}) => {
  return (
    <div className="orders-section">
      <h2 className="section-heading">Meus Pedidos</h2>
      {loading ? (
        <p className="loading-text">Carregando pedidos...</p>
      ) : orders.length === 0 ? (
        <p className="empty-state-text">Nenhum pedido recebido ainda.</p>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead className="table-header">
              <tr>
                <th className="table-th">ID do Pedido</th>
                <th className="table-th">Cliente</th>
                <th className="table-th">Total</th>
                <th className="table-th">Status</th>
                <th className="table-th">Data</th>
                <th className="table-th">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="table-row">
                  <td className="table-td">{order._id.substring(0, 8)}...</td>
                  <td className="table-td">{order.clientName}</td>
                  <td className="table-td">R$ {order.total.toFixed(2)}</td>
                  <td className="table-td">
                    <span className={`status-badge ${
                      order.status === 'pending' ? 'status-pending' :
                      order.status === 'preparing' ? 'status-preparing' :
                      'status-delivered'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="table-td">{new Date(order.orderDate).toLocaleDateString('pt-BR')}</td>
                  <td className="table-td table-actions">
                    <Button onClick={() => onViewDetails(order)} className="btn-blue btn-xs">
                      Ver Detalhes
                    </Button>
                    {order.status === 'pending' && (
                      <Button onClick={() => onUpdateStatus(order._id, 'preparing')} className="btn-indigo btn-xs">
                        Marcar como Preparando
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button onClick={() => onUpdateStatus(order._id, 'delivered')} className="btn-green btn-xs">
                        Marcar como Entregue
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && currentOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-heading">Detalhes do Pedido #{currentOrder._id.substring(0, 8)}</h3>
            <div className="order-details-content">
              <p><strong>Cliente:</strong> {currentOrder.clientName}</p>
              <p><strong>Telefone:</strong> {currentOrder.clientPhone}</p>
              <p><strong>Endereço:</strong> {currentOrder.clientAddress || 'Não informado'}</p>
              <p><strong>Observações:</strong> {currentOrder.observations || 'N/A'}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${
                currentOrder.status === 'pending' ? 'status-pending' :
                currentOrder.status === 'preparing' ? 'status-preparing' :
                'status-delivered'
              }`}>
                {currentOrder.status}
              </span></p>
              <p><strong>Total:</strong> R$ {currentOrder.total.toFixed(2)}</p>
              <h4 className="order-items-heading">Itens:</h4>
              <ul className="order-items-list">
                {currentOrder.items.map((item, index) => (
                  <li key={index} className="order-item-list-item">
                    {item.quantity}x {item.name} (R$ {item.price.toFixed(2)} cada)
                    {item.observations && <span className="order-item-observations">(Obs: {item.observations})</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-actions">
              <Button onClick={() => setShowModal(false)} className="btn-blue">
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersSection;