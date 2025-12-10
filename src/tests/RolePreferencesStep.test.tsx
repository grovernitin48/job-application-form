import React, { useEffect } from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { RolePreferencesStep } from "../steps/RolePreferencesStep";
import { FormProvider, useFormContext } from "../context/FormContext";
import { render } from "@testing-library/react";

// Helper to set initial experience.reactYears via context
const WithExperienceSetup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { updateForm } = useFormContext();

  useEffect(() => {
    updateForm({
      experience: {
        yearsOfExperience: 5,
        currentRole: "",
        primaryTechStack: "",
        reactYears: 4,
        teamLeadExperience: false,
        summary: "",
        mentorshipRequired: false,
      },
    });
  }, [updateForm]);

  return <>{children}</>;
};

const renderRolePreferences = () => {
  return render(
    <BrowserRouter>
      <FormProvider>
        <WithExperienceSetup>
          <RolePreferencesStep />
        </WithExperienceSetup>
      </FormProvider>
    </BrowserRouter>
  );
};

describe.skip("RolePreferencesStep", () => {
  it("shows portfolio URLs section when preferred role is Frontend and reactYears > 3", async () => {
    const user = userEvent.setup();
    const { container } = renderRolePreferences();

    const roleSelect = screen.getByLabelText(/preferred role/i);

    await user.selectOptions(roleSelect, "frontend");

    expect(screen.getByText(/portfolio urls/i)).toBeInTheDocument();

    const urlInputs = container.querySelectorAll('input[placeholder^="https://"]');
    expect(urlInputs.length).toBeGreaterThan(0);
  });

  it("hides portfolio URLs section when preferred role is Backend", async () => {
    const user = userEvent.setup();
    renderRolePreferences();

    const roleSelect = screen.getByLabelText(/preferred role/i);

    await user.selectOptions(roleSelect, "backend");

    expect(screen.queryByText(/portfolio urls/i)).not.toBeInTheDocument();
  });
});
