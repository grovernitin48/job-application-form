import React from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  id,
  error,
  helperText,
  ...rest
}) => {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
      </label>
      <input id={id} className="form-field__input" {...rest} />
      {helperText && !error && <p className="form-field__helper">{helperText}</p>}
      {error && <p className="form-field__error">{error}</p>}
    </div>
  );
};
