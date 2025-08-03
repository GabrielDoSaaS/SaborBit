import React from 'react';

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