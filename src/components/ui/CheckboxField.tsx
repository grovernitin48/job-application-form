import React from "react";

interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  // optional id; if not passed, caller can still spread {...register()}
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, id, ...rest }) => {
  return (
    <div className="form-field">
      <label className="form-checkbox">
        <input id={id} type="checkbox" className="form-checkbox__input" {...rest} />
        <span className="form-checkbox__label">{label}</span>
      </label>
    </div>
  );
};
