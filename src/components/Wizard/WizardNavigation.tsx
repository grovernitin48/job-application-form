import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { useFormContext } from "../../context/FormContext";

interface WizardNavigationProps {
  next?: string;
  back?: string;
  onResetStep?: () => void; // ⬅️ NEW: optional callback from step
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  next,
  back,
  onResetStep,
}) => {
  const navigate = useNavigate();
  const { resetForm } = useFormContext();

  const handleReset = () => {
    if (
      window.confirm(
        "This will clear your draft data and restart the application. Continue?"
      )
    ) {
      // Let the current step reset its local form state (RHF)
      onResetStep?.();

      // Reset global form context + localStorage
      resetForm();

      // Go back to the first step
      navigate("/step/personal");
    }
  };

  return (
    <div className="wizard-nav">
      {back ? (
        <Button type="button" variant="secondary" onClick={() => navigate(back)}>
          Back
        </Button>
      ) : (
        <div className="wizard-nav__spacer" />
      )}

      <div className="wizard-nav__right">
        <Button type="button" variant="ghost" onClick={handleReset}>
          Reset
        </Button>
        {next && (
          <Button type="submit" variant="primary">
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
