import React from 'react';
import Button from '../common/Button';
import '../../styles/QrSection.css';

interface QrSectionProps {
  qrCodeUrl: string;
  loading: boolean;
  chefId: string;
  onGenerateQr: () => void;
}

const QrSection: React.FC<QrSectionProps> = ({ qrCodeUrl, loading, chefId, onGenerateQr }) => {
  return (
    <div className="qr-section-container">
      <h2 className="qr-section-heading">Gerar QR Code do Cardápio</h2>
      <p className="qr-description">
        Compartilhe este QR Code com seus clientes para que eles acessem seu cardápio online!
      </p>
      <Button onClick={onGenerateQr} disabled={loading} className="qr-generate-btn">
        {loading ? 'Gerando...' : 'Gerar QR Code'}
      </Button>
      {qrCodeUrl && (
        <div className="qr-display-wrapper">
          <p className="qr-display-text">Seu QR Code:</p>
          <img src={qrCodeUrl} alt="QR Code do Cardápio" className="qr-image" />
          <p className="qr-url-text">
            URL do seu cardápio: <a href={`${window.location.origin}/public-menu/${chefId}`} target="_blank" rel="noopener noreferrer" className="qr-url-link">{`${window.location.origin}/public-menu/${chefId}`}</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default QrSection;