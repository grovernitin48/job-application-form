import { z } from "zod";

/**
 * PERSONAL INFO
 * - fullName: required, at least 2 chars
 * - email: required, valid email
 */
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

/**
 * EXPERIENCE
 * - yearsOfExperience: required, >= 0
 * - currentRole: required
 * - primaryTechStack: required
 * - reactYears: optional / nullable, >= 0 if provided
 * - teamLeadExperience: boolean
 * - summary: optional text
 * - mentorshipRequired: boolean
 */
export const experienceSchema = z.object({
  yearsOfExperience: z.coerce.number().min(0, "Years of experience must be 0 or greater"),
  currentRole: z
    .string()
    .min(1, "Current role is required")
    .max(100, "Current role is too long"),
  primaryTechStack: z
    .string()
    .min(1, "Primary tech stack is required")
    .max(200, "Tech stack description is too long"),
  reactYears: z.coerce
    .number()
    .min(0, "React years must be 0 or greater")
    .nullable()
    .optional(),
  teamLeadExperience: z.boolean(),
  summary: z.string().max(2000, "Summary is too long").optional().or(z.literal("")),
  mentorshipRequired: z.boolean(),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

/**
 * ROLE PREFERENCES
 * - preferredRole: required (non-empty)
 * - workLocationType: required (non-empty)
 * - expectedSalary: optional, but if provided must be >= 0
 * - openToRelocation: boolean
 * - portfolioUrls: array of { url: string }
 * - notes: optional
 */
export const rolePreferencesSchema = z.object({
  preferredRole: z
    .enum(["frontend", "backend", "fullstack", "devops", ""])
    .refine((val) => val !== "", {
      message: "Preferred role is required",
    }),
  workLocationType: z
    .enum(["remote", "hybrid", "onsite", ""])
    .refine((val) => val !== "", {
      message: "Work mode is required",
    }),
  expectedSalary: z.coerce
    .number()
    .min(0, "Salary must be 0 or greater")
    .nullable()
    .optional(),
  openToRelocation: z.boolean(),
  portfolioUrls: z
    .array(
      z.object({
        url: z.string().max(500, "URL is too long").optional().or(z.literal("")),
      })
    )
    .optional(),
  notes: z.string().max(2000, "Notes are too long").optional().or(z.literal("")),
});

export type RolePreferencesFormValues = z.infer<typeof rolePreferencesSchema>;
