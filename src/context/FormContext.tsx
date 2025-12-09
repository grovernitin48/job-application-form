// src/context/FormContext.tsx
import React, { createContext, useContext, useState } from "react";

/**
 * We'll refine these types later when we define schemas.
 */
export interface PersonalInfo {
  fullName: string;
  email: string;
}

export interface ExperienceInfo {
  yearsOfExperience: number | null;
  // more fields later
}

export interface RolePreferencesInfo {
  preferredRole: string;
  // more fields later
}

export interface JobApplicationForm {
  personalInfo: PersonalInfo;
  experience: ExperienceInfo;
  rolePreferences: RolePreferencesInfo;
}

interface FormContextValue {
  data: JobApplicationForm;
  updateForm: (patch: Partial<JobApplicationForm>) => void;
  resetForm: () => void;
}

const defaultForm: JobApplicationForm = {
  personalInfo: {
    fullName: "",
    email: "",
  },
  experience: {
    yearsOfExperience: null,
  },
  rolePreferences: {
    preferredRole: "",
  },
};

const FormContext = createContext<FormContextValue | undefined>(undefined);

/**
 * FormProvider – holds global wizard state.
 * We'll later plug in autosave, localStorage hydration, etc.
 */
export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<JobApplicationForm>(defaultForm);

  const updateForm = (patch: Partial<JobApplicationForm>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const resetForm = () => setData(defaultForm);

  return (
    <FormContext.Provider value={{ data, updateForm, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = (): FormContextValue => {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return ctx;
};
