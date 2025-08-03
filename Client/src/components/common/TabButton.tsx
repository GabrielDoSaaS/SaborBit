import React from 'react';
import '../../styles/TabButton.css';

interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`tab-button ${active ? 'tab-button-active' : ''}`}
  >
    {label}
  </button>
);

export default TabButton;