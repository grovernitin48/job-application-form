import React, { createContext, useContext, useState } from "react";

// --------- Types for each step ---------
export interface PersonalInfo {
  fullName: string;
  email: string;
}

export interface ExperienceInfo {
  yearsOfExperience: number | null;
  currentRole: string;
  primaryTechStack: string;
  reactYears: number | null;
  teamLeadExperience: boolean;
  summary: string;
  mentorshipRequired: boolean;
}

export interface RolePreferencesInfo {
  preferredRole: "frontend" | "backend" | "fullstack" | "devops" | "";
  workLocationType: "remote" | "hybrid" | "onsite" | "";
  expectedSalary: number | null;
  openToRelocation: boolean;
  portfolioUrls: string[];
  notes: string;
}

export interface JobApplicationForm {
  personalInfo: PersonalInfo;
  experience: ExperienceInfo;
  rolePreferences: RolePreferencesInfo;
}

// --------- Context shape ---------
interface FormContextValue {
  data: JobApplicationForm;
  updateForm: (patch: Partial<JobApplicationForm>) => void;
  resetForm: () => void;
}

// --------- Defaults ---------
const defaultForm: JobApplicationForm = {
  personalInfo: {
    fullName: "",
    email: "",
  },
  experience: {
    yearsOfExperience: null,
    currentRole: "",
    primaryTechStack: "",
    reactYears: null,
    teamLeadExperience: false,
    summary: "",
    mentorshipRequired: false,
  },
  rolePreferences: {
    preferredRole: "",
    workLocationType: "",
    expectedSalary: null,
    openToRelocation: false,
    portfolioUrls: [],
    notes: "",
  },
};

const FormContext = createContext<FormContextValue | undefined>(undefined);

/**
 * FormProvider – holds global wizard state.
 * We'll later:
 * - plug in auto-save to localStorage
 * - hydrate from drafts
 * - add reset logic to clear drafts
 */
export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<JobApplicationForm>(defaultForm);

  const updateForm = (patch: Partial<JobApplicationForm>) => {
    // For now we replace sections (personalInfo / experience / rolePreferences)
    // based on what is passed in patch.
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
