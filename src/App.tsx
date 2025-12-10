// src/App.tsx
import React from "react";
import { DRAFT_STORAGE_KEY } from "./utils/storageKeys";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WizardLayout } from "./components/Layout/WizardLayout";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { ExperienceStep } from "./steps/ExperienceStep";
import { RolePreferencesStep } from "./steps/RolePreferencesStep";
import { ReviewSubmitStep } from "./steps/ReviewSubmitStep";
import { FormProvider } from "./context/FormContext";
import "./styles/main.css";

const App: React.FC = () => {
  const getInitialPath = (): string => {
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return "/step/personal";

      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.lastStep === "string") {
        return parsed.lastStep;
      }
    } catch {
      // ignore errors and fall back
    }
    return "/step/personal";
  };

  const initialPath = getInitialPath();

  return (
    <BrowserRouter>
      {/* FormProvider will hold global wizard state */}
      <FormProvider>
        <WizardLayout>
          <Routes>
            <Route path="/" element={<Navigate to={initialPath} replace />} />
            <Route path="/step/personal" element={<PersonalInfoStep />} />
            <Route path="/step/experience" element={<ExperienceStep />} />
            <Route path="/step/preferences" element={<RolePreferencesStep />} />
            <Route path="/step/review" element={<ReviewSubmitStep />} />
          </Routes>
        </WizardLayout>
      </FormProvider>
    </BrowserRouter>
  );
};

export default App;
