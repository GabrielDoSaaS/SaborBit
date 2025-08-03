import React from 'react';
import type { Chef } from '../../types/types';
import Button from '../common/Button';
import '../../styles/PlansSection.css';

interface PlansSectionProps {
  chefData: Chef;
  loading: boolean;
  onSubscribe: (planType: 'mensal' | 'anual') => void;
}

const PlansSection: React.FC<PlansSectionProps> = ({ chefData, loading, onSubscribe }) => {
  const isPlanActive = chefData.planoAtivo && (!chefData.dataExpiracaoPlano || new Date(chefData.dataExpiracaoPlano) > new Date());
  const expirationDate = chefData.dataExpiracaoPlano ? new Date(chefData.dataExpiracaoPlano).toLocaleDateString('pt-BR') : 'N/A';

  return (
    <div className="plans-section-container">
      <h2 className="plans-section-heading">Meus Planos de Assinatura</h2>
      <div className="plan-status-card">
        <p className={`plan-status-text ${isPlanActive ? 'plan-status-active' : 'plan-status-inactive'}`}>
          Status do Plano: {isPlanActive ? 'Ativo' : 'Inativo'}
        </p>
        <p className="plan-expiration-text">Data de Expiração: {expirationDate}</p>
        {!isPlanActive && (
          <p className="plan-inactive-message">Seu plano está inativo ou expirou. Por favor, renove para continuar usando todos os recursos.</p>
        )}
      </div>

      <div className="plans-grid">
        <div className="plan-card plan-card-monthly">
          <h3 className="plan-title">Plano Mensal</h3>
          <p className="plan-price">R$ 59,90<span className="plan-price-suffix">/mês</span></p>
          <p className="plan-description">Ideal para começar e testar a plataforma.</p>
          <ul className="plan-features-list">
            <li className="plan-feature-item"><span className="plan-feature-icon">&#10003;</span> Cardápio Online Personalizado</li>
            <li className="plan-feature-item"><span className="plan-feature-icon">&#10003;</span> Gerenciamento de Pedidos</li>
            <li className="plan-feature-item"><span className="plan-feature-icon">&#10003;</span> Geração de QR Code</li>
            <li className="plan-feature-item"><span className="plan-feature-icon">&#10003;</span> Suporte Básico</li>
          </ul>
          <Button onClick={() => onSubscribe('mensal')} disabled={loading} className="plan-button">
            {loading ? 'Processando...' : 'Assinar Plano Mensal'}
          </Button>
        </div>

        <div className="plan-card plan-card-annual">
          <span className="plan-badge">MAIS POPULAR!</span>
          <h3 className="plan-title">Plano Anual</h3>
          <p className="plan-price">R$ 599,00<span className="plan-price-suffix">/ano</span></p>
          <p className="plan-description">Economize e tenha acesso completo por 1 ano.</p>
          <ul className="plan-features-list">
            <li className="plan-feature-item"><span className="plan-feature-icon">&#10003;</span> Todos os recursos do Plano Mensal</li>
            <li className="plan-feature-item"><span className="plan-feature-icon">&#10003;</span> Suporte Prioritário</li>
            <li className="plan-feature-item"><span className="plan-feature-icon">&#10003;</span> Novas funcionalidades exclusivas</li>
            <li className="plan-feature-item"><span className="plan-feature-icon">&#10003;</span> Renovação automática opcional</li>
          </ul>
          <Button onClick={() => onSubscribe('anual')} disabled={loading} className="plan-button plan-button-highlight">
            {loading ? 'Processando...' : 'Assinar Plano Anual'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlansSection;