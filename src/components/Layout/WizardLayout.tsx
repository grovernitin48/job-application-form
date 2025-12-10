// src/components/Layout/WizardLayout.tsx
import React, { useEffect }  from "react";
import { useLocation } from "react-router-dom";
import { useFormContext } from "../../context/FormContext";
interface WizardLayoutProps {
  children: React.ReactNode;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { setCurrentStep } = useFormContext();

  useEffect(() => {
    // Anytime the route changes, remember it as the current step
    setCurrentStep(location.pathname);
  }, [location.pathname, setCurrentStep]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f5f7fb",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <header
        style={{
          padding: "1rem 2rem",
          background: "#1e293b",
          color: "#f9fafb",
          boxShadow: "0 2px 4px rgba(15, 23, 42, 0.3)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
          Job Application – Adaptive Form Wizard
        </h1>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "2rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            background: "#ffffff",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};
