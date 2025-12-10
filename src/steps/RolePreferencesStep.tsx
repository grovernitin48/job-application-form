// src/steps/RolePreferencesStep.tsx
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFormContext } from "../context/FormContext";
import {
  rolePreferencesSchema,
  type RolePreferencesFormValues,
} from "../validation/jobApplicationSchemas";
import { WizardNavigation } from "../components/Wizard/WizardNavigation";
import { SelectField } from "../components/ui/SelectField";
import { TextField } from "../components/ui/TextField";
import { TextAreaField } from "../components/ui/TextAreaField";
import { CheckboxField } from "../components/ui/CheckboxField";
import { Button } from "../components/ui/Button";

export const RolePreferencesStep: React.FC = () => {
  const { data, updateForm } = useFormContext();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RolePreferencesFormValues>({
    mode: "onBlur",
    resolver: zodResolver(rolePreferencesSchema) as any,
    defaultValues: {
      preferredRole: data.rolePreferences.preferredRole || "",
      workLocationType: data.rolePreferences.workLocationType || "",
      expectedSalary: data.rolePreferences.expectedSalary ?? null,
      openToRelocation: data.rolePreferences.openToRelocation,
      portfolioUrls: data.rolePreferences.portfolioUrls ?? [],
      notes: data.rolePreferences.notes ?? "",
    },
  });

  const watchedRole = watch("preferredRole");
  const { experience } = data;
  const reactYears = experience.reactYears ?? 0;

  const showPortfolio =
    watchedRole === "frontend" && typeof reactYears === "number" && reactYears > 3;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "portfolioUrls",
  });

  // Sync role preferences to global context
  useEffect(() => {
    const subscription = watch((values) => {
      updateForm({
        rolePreferences: {
          ...data.rolePreferences,
          ...values,
          expectedSalary:
            typeof values.expectedSalary === "number" ? values.expectedSalary : null,
          portfolioUrls:
            values.portfolioUrls?.map((item) => ({
              url: item?.url ?? "",
            })) ?? [],
        },
      });
    });

    return () => subscription.unsubscribe();
  }, [watch, updateForm, data.rolePreferences]);

  const onSubmit = (values: RolePreferencesFormValues) => {
    updateForm({
      rolePreferences: {
        ...data.rolePreferences,
        ...values,
        expectedSalary:
          typeof values.expectedSalary === "number" ? values.expectedSalary : null,
        portfolioUrls:
          values.portfolioUrls?.map((item) => ({
            url: item?.url ?? "",
          })) ?? [],
      },
    });

    navigate("/step/review");
  };

  const preferredRoleError = errors.preferredRole?.message as string | undefined;
  const workLocationError = errors.workLocationType?.message as string | undefined;
  const salaryError = errors.expectedSalary?.message as string | undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step" noValidate>
      <h2 className="form-step__title">Role Preferences</h2>
      <p className="form-step__subtitle">
        Tell us what kind of role and work environment you&apos;re looking for. The form
        will adapt based on your experience and preferences.
      </p>

      {/* Preferred Role */}
      <SelectField
        id="preferredRole"
        label="Preferred Role"
        error={preferredRoleError}
        {...register("preferredRole")}
      >
        <option value="">Select a role</option>
        <option value="frontend">Frontend Engineer</option>
        <option value="backend">Backend Engineer</option>
        <option value="fullstack">Fullstack Engineer</option>
        <option value="devops">DevOps / SRE</option>
      </SelectField>

      {/* Work Location */}
      <SelectField
        id="workLocationType"
        label="Work Mode"
        error={workLocationError}
        {...register("workLocationType")}
      >
        <option value="">Select work mode</option>
        <option value="remote">Remote</option>
        <option value="hybrid">Hybrid</option>
        <option value="onsite">Onsite</option>
      </SelectField>

      {/* Expected Salary */}
      <TextField
        id="expectedSalary"
        type="number"
        label="Expected Salary (per year, in your currency)"
        error={salaryError}
        helperText={
          !salaryError
            ? "You can provide an approximate expectation; this is not a binding number."
            : undefined
        }
        placeholder="e.g. 1200000"
        {...register("expectedSalary", { valueAsNumber: true })}
      />

      {/* Open to relocation */}
      <CheckboxField label="I'm open to relocation" {...register("openToRelocation")} />
      {/* Portfolio URLs – only if frontend + reactYears > 3 */}
      {showPortfolio && (
        <section className="section-card section-card--muted form-array">
          <div className="form-array__header">
            <div>
              <h3 className="form-array__title">Portfolio URLs</h3>
              <p className="form-array__hint">
                Share your best work: GitHub repos, live apps, or case studies.
              </p>
            </div>
            <Button type="button" variant="ghost" onClick={() => append({ url: "" })}>
              + Add URL
            </Button>
          </div>

          <div className="form-array__items">
            {fields.map((field, index) => {
              const urlError = errors.portfolioUrls?.[index]?.url?.message as
                | string
                | undefined;

              return (
                <div className="form-array__item" key={field.id}>
                  <input
                    className="form-field__input form-array__item-input"
                    placeholder="https://example.com/your-work"
                    {...register(`portfolioUrls.${index}.url` as const)}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    className="form-array__item-remove"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                  {urlError && <p className="form-field__error">{urlError}</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Notes */}
      <TextAreaField
        id="notes"
        label="Additional Notes (optional)"
        rows={3}
        placeholder="Anything else we should know about your preferences?"
        error={errors.notes?.message as string | undefined}
        {...register("notes")}
      />

      <WizardNavigation back="/step/experience" next="/step/review" />
    </form>
  );
};
