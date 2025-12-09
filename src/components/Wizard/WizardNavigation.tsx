// src/components/Wizard/WizardNavigation.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface WizardNavigationProps {
  next?: string;
  back?: string;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  next,
  back,
}) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        marginTop: "2rem",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {back ? (
        <button
          onClick={() => navigate(back)}
          style={{
            padding: "0.6rem 1.2rem",
            background: "#e2e8f0",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      ) : (
        <div />
      )}

      {next && (
        <button
          type="submit"
          style={{
            padding: "0.6rem 1.2rem",
            background: "#2563eb",
            color: "white",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Next
        </button>
      )}
    </div>
  );
};
