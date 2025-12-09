// src/schemas/rolePreferencesSchema.ts
import type { RolePreferencesInfo } from "../context/FormContext";

export type RolePreferencesFormValues = RolePreferencesInfo;

export type RoleFieldType = "select" | "number" | "textarea" | "checkbox";

export interface RolePreferenceFieldSchema {
  name: keyof RolePreferencesFormValues;
  label: string;
  type: RoleFieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

/**
 * Schema for the main Role Preferences fields.
 * - portfolioUrls is handled separately as a repeatable field
 */
export const rolePreferencesFields: RolePreferenceFieldSchema[] = [
  {
    name: "preferredRole",
    label: "Preferred Role",
    type: "select",
    options: [
      { label: "Select a role", value: "" },
      { label: "Frontend Engineer", value: "frontend" },
      { label: "Backend Engineer", value: "backend" },
      { label: "Fullstack Engineer", value: "fullstack" },
      { label: "DevOps / SRE", value: "devops" },
    ],
  },
  {
    name: "workLocationType",
    label: "Preferred Work Mode",
    type: "select",
    options: [
      { label: "Select work mode", value: "" },
      { label: "Remote", value: "remote" },
      { label: "Hybrid", value: "hybrid" },
      { label: "Onsite", value: "onsite" },
    ],
  },
  {
    name: "expectedSalary",
    label: "Expected Salary (annual, in your currency)",
    type: "number",
    placeholder: "e.g. 1200000",
  },
  {
    name: "openToRelocation",
    label: "Open to relocation?",
    type: "checkbox",
  },
  {
    name: "notes",
    label: "Additional Notes / Preferences",
    type: "textarea",
    placeholder: "Anything else we should know about your preferences?",
  },
];
