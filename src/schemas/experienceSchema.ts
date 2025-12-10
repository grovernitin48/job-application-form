import type { ExperienceFormValues } from "../validation/jobApplicationSchemas";

export type ExperienceFieldType = "text" | "number" | "textarea" | "checkbox";

/**
 * Field schema for Experience step.
 * Uses ExperienceFormValues as the source of field names.
 */
export interface ExperienceFieldSchema {
  name: keyof ExperienceFormValues;
  label: string;
  type: ExperienceFieldType;
  placeholder?: string;
  isAdvanced?: boolean; // advanced fields hidden when yearsOfExperience < 2
}

/**
 * Schema describing the Experience step fields.
 */
export const experienceFields: ExperienceFieldSchema[] = [
  {
    name: "yearsOfExperience",
    label: "Total Years of Experience",
    type: "number",
    placeholder: "e.g. 1, 2, 5",
  },
  {
    name: "currentRole",
    label: "Current Role / Title",
    type: "text",
    placeholder: "e.g. Frontend Engineer",
  },
  {
    name: "primaryTechStack",
    label: "Primary Tech Stack",
    type: "text",
    placeholder: "e.g. React, TypeScript, Node.js",
  },
  {
    name: "reactYears",
    label: "React Experience (years)",
    type: "number",
    isAdvanced: true,
    placeholder: "e.g. 0, 1, 3",
  },
  {
    name: "teamLeadExperience",
    label: "Have you led a team before?",
    type: "checkbox",
    isAdvanced: true,
  },
  {
    name: "summary",
    label: "Short Summary of Experience",
    type: "textarea",
    isAdvanced: true,
    placeholder: "Highlight key projects or responsibilities...",
  },
];
