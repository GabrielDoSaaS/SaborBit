import React from 'react';
import '../../styles/MessageModal.css';

interface MessageModalProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColorClass = type === 'success' ? 'message-alert-success' :
                      type === 'error' ? 'message-alert-error' : 'message-alert-info';
  const textColorClass = type === 'success' ? 'text-green-700' :
                        type === 'error' ? 'text-red-700' : 'text-blue-700';

  return (
    <div className="message-modal-overlay">
      <div className="message-modal-content">
        <div className={`message-alert ${bgColorClass}`} role="alert">
          <p className="font-bold">{type === 'success' ? 'Sucesso!' :
                              type === 'error' ? 'Erro!' : 'Informação!'}</p>
          <p className={textColorClass}>{message}</p>
        </div>
        <div className="message-modal-actions">
          <button
            onClick={onClose}
            className="message-button"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;