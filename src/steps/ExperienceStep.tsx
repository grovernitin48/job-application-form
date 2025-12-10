// src/steps/ExperienceStep.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFormContext } from "../context/FormContext";
import { experienceFields } from "../schemas/experienceSchema";
import {
  experienceSchema,
  type ExperienceFormValues,
} from "../validation/jobApplicationSchemas";
import { WizardNavigation } from "../components/Wizard/WizardNavigation";
import { TextField } from "../components/ui/TextField";
import { TextAreaField } from "../components/ui/TextAreaField";
import { CheckboxField } from "../components/ui/CheckboxField";

export const ExperienceStep: React.FC = () => {
  const { data, updateForm } = useFormContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    mode: "onBlur",
    // Small cast because of RHF + zodResolver typing mismatch. Runtime is safe.
    resolver: zodResolver(experienceSchema) as any,
    defaultValues: {
      yearsOfExperience: data.experience.yearsOfExperience ?? 0,
      currentRole: data.experience.currentRole,
      primaryTechStack: data.experience.primaryTechStack,
      reactYears: data.experience.reactYears ?? undefined,
      teamLeadExperience: data.experience.teamLeadExperience,
      summary: data.experience.summary ?? "",
      mentorshipRequired: data.experience.mentorshipRequired,
    },
  });

  const watchedValues = watch();
  const yearsOfExperience = watchedValues.yearsOfExperience ?? 0;

  const showAdvanced = yearsOfExperience >= 2;
  const showMentorship = yearsOfExperience > 0 && yearsOfExperience < 2;

  const baseFields = experienceFields.filter((field) => !field.isAdvanced);
  const advancedFields = experienceFields.filter((field) => field.isAdvanced);

  // Keep Experience data in global context synced to form values
  useEffect(() => {
    const subscription = watch((values) => {
      updateForm({
        experience: {
          ...data.experience,
          ...values,
          yearsOfExperience:
            typeof values.yearsOfExperience === "number"
              ? values.yearsOfExperience
              : null,
          reactYears: typeof values.reactYears === "number" ? values.reactYears : null,
        },
      });
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, [watch, updateForm, data.experience]);

  const onSubmit = (values: ExperienceFormValues) => {
    updateForm({
      experience: {
        ...data.experience,
        ...values,
        yearsOfExperience: values.yearsOfExperience,
        reactYears: typeof values.reactYears === "number" ? values.reactYears : null,
      },
    });

    navigate("/step/preferences");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step" noValidate>
      <h2 className="form-step__title">Experience</h2>
      <p className="form-step__subtitle">
        Tell us about your professional background. The form adapts based on your total
        experience.
      </p>

      {/* Base fields – always visible, from typed schema */}
      {baseFields.map((field) => {
        const fieldError = errors[field.name];
        const errorMessage = fieldError?.message as string | undefined;

        if (field.type === "checkbox") {
          return (
            <CheckboxField
              key={field.name}
              label={field.label}
              {...register(field.name)}
            />
          );
        }

        if (field.type === "textarea") {
          return (
            <TextAreaField
              key={field.name}
              id={field.name}
              label={field.label}
              error={errorMessage}
              placeholder={field.placeholder}
              {...register(field.name)}
            />
          );
        }

        // number / text fields
        const isNumber = field.type === "number";

        return (
          <TextField
            key={field.name}
            id={field.name}
            type={isNumber ? "number" : "text"}
            label={field.label}
            error={errorMessage}
            placeholder={field.placeholder}
            {...register(field.name, {
              ...(isNumber ? { valueAsNumber: true } : {}),
            })}
          />
        );
      })}

      {/* Advanced fields – only if yearsOfExperience >= 2 */}
      {showAdvanced && (
        <section className="section-card section-card--muted">
          <h3 className="section-card__title">Advanced Experience</h3>
          <p className="section-card__subtitle">
            Since you have at least 2 years of experience, we&apos;d like to know more
            about your responsibilities and React background.
          </p>

          {advancedFields.map((field) => {
            const fieldError = errors[field.name];
            const errorMessage = fieldError?.message as string | undefined;

            if (field.type === "checkbox") {
              return (
                <CheckboxField
                  key={field.name}
                  label={field.label}
                  {...register(field.name)}
                />
              );
            }

            if (field.type === "textarea") {
              return (
                <TextAreaField
                  key={field.name}
                  id={field.name}
                  label={field.label}
                  error={errorMessage}
                  placeholder={field.placeholder}
                  rows={3}
                  {...register(field.name)}
                />
              );
            }

            const isNumber = field.type === "number";

            return (
              <TextField
                key={field.name}
                id={field.name}
                type={isNumber ? "number" : "text"}
                label={field.label}
                error={errorMessage}
                placeholder={field.placeholder}
                {...register(field.name, {
                  ...(isNumber ? { valueAsNumber: true } : {}),
                })}
              />
            );
          })}
        </section>
      )}

      {/* Mentorship section – only if yearsOfExperience < 2 */}
      {showMentorship && (
        <section className="section-card section-card--info">
          <h3 className="section-card__title">Early-career support</h3>
          <p className="section-card__subtitle">
            Since you have less than 2 years of experience, we&apos;d like to know whether
            structured mentorship would help you ramp up.
          </p>

          <CheckboxField
            label="Mentorship required?"
            {...register("mentorshipRequired")}
          />
        </section>
      )}

      <WizardNavigation back="/step/personal" next="/step/preferences" />
    </form>
  );
};
