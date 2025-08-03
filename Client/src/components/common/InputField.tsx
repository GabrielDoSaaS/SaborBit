import React from 'react';

interface InputFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'file';
  name: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filePreview?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  onFileChange, 
  filePreview,
  className = ''
}) => (
  <div className={`input-group ${className}`}>
    <label htmlFor={name} className="input-label">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === 'file' ? (
      <>
        <input
          type="file"
          id={name}
          name={name}
          onChange={onFileChange}
          required={required}
          className="input-field"
          accept="image/*"
        />
        {filePreview && (
          <div className="file-preview-container">
            <img src={filePreview} alt="Pré-visualização" className="file-preview-image" />
          </div>
        )}
      </>
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input-field"
      />
    )}
  </div>
);

export default InputField;