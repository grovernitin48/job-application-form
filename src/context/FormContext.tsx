import React, { createContext, useContext, useState, useEffect } from "react";
import { DRAFT_STORAGE_KEY } from "../utils/storageKeys";

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
  portfolioUrls: { url: string }[];
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

  currentStep: string;
  setCurrentStep: (step: string) => void;
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
 * - Initializes from localStorage draft
 * - Auto-saves data + last step back to localStorage
 */
export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<JobApplicationForm>(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return defaultForm;

      const parsed = JSON.parse(raw);
      if (parsed && parsed.data) {
        return { ...defaultForm, ...parsed.data };
      }
    } catch {
      // ignore
    }
    return defaultForm;
  });

  const [currentStep, setCurrentStep] = useState<string>(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return "/step/personal";

      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.lastStep === "string") {
        return parsed.lastStep;
      }
    } catch {
      // ignore
    }
    return "/step/personal";
  });

  const updateForm = (patch: Partial<JobApplicationForm>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const resetForm = () => {
    setData(defaultForm);
    setCurrentStep("/step/personal");
  };

  // Auto-save whenever data or currentStep changes
  useEffect(() => {
    try {
      const payload = JSON.stringify({
        data,
        lastStep: currentStep,
      });
      window.localStorage.setItem(DRAFT_STORAGE_KEY, payload);
    } catch {
      // ignore storage errors
    }
  }, [data, currentStep]);

  return (
    <FormContext.Provider
      value={{ data, updateForm, resetForm, currentStep, setCurrentStep }}
    >
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
