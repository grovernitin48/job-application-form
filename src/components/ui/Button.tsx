import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  ...rest
}) => {
  const base = "button"; // from CSS
  const variantClass =
    variant === "primary"
      ? "button--primary"
      : variant === "secondary"
        ? "button--secondary"
        : variant === "ghost"
          ? "button--ghost"
          : "button--danger";

  const finalClassName = `${base} ${variantClass} ${className}`.trim();

  return (
    <button className={finalClassName} {...rest}>
      {children}
    </button>
  );
};
