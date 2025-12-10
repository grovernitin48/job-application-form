import React from "react";

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  error,
  helperText,
  children,
  ...rest
}) => {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
      </label>
      <select id={id} className="form-field__select" {...rest}>
        {children}
      </select>
      {helperText && !error && <p className="form-field__helper">{helperText}</p>}
      {error && <p className="form-field__error">{error}</p>}
    </div>
  );
};
