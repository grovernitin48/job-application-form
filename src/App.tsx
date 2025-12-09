// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WizardLayout } from "./components/Layout/WizardLayout";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { ExperienceStep } from "./steps/ExperienceStep";
import { RolePreferencesStep } from "./steps/RolePreferencesStep";
import { ReviewSubmitStep } from "./steps/ReviewSubmitStep";
import { FormProvider } from "./context/FormContext";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* FormProvider will hold global wizard state */}
      <FormProvider>
        <WizardLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/step/personal" replace />} />
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
