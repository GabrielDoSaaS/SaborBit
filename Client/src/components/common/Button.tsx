import React from 'react';
import '../../styles/Button.css';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = '',
  type = 'button',
  disabled = false
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`btn ${className} ${disabled ? 'btn-disabled' : ''}`}
  >
    {children}
  </button>
);

export default Button;