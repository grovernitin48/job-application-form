import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import {
  rolePreferencesFields,
  type RolePreferencesFormValues,
} from "../schemas/rolePreferencesSchema";
import { WizardNavigation } from "../components/Wizard/WizardNavigation";

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
    defaultValues: data.rolePreferences,
  });

  const { fields, append, remove } = useFieldArray<RolePreferencesFormValues>({
    control,
    name: "portfolioUrls",
  });

  // ensure at least one empty input
  useEffect(() => {
    if (fields.length === 0) {
      append({ url: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-sync role preferences into global context
  useEffect(() => {
    const subscription = watch((values) => {
      const raw = values.portfolioUrls ?? [];

      // Ensure we always end up with { url: string }[]
      const normalizedUrls: { url: string }[] = raw
        .filter((item): item is { url?: string } => item !== undefined)
        .map((item) => ({
          url: item.url ?? "",
        }));

      updateForm({
        rolePreferences: {
          ...data.rolePreferences,
          ...values,
          portfolioUrls: normalizedUrls,
        },
      });
    });

    return () => subscription.unsubscribe();
  }, [watch, updateForm, data.rolePreferences]);

  const preferredRole = watch("preferredRole");
  const showPortfolioUrls =
    preferredRole === "frontend" &&
    typeof data.experience.reactYears === "number" &&
    data.experience.reactYears > 3;

  const onSubmit = (values: RolePreferencesFormValues) => {
    // Clean empty URLs
    const cleanedUrls = (values.portfolioUrls || []).filter(
      (item) => item && item.url.trim().length > 0
    );

    updateForm({
      rolePreferences: {
        ...values,
        portfolioUrls: cleanedUrls,
      },
    });

    navigate("/step/review");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 style={{ marginBottom: "0.5rem" }}>Role Preferences</h2>
      <p style={{ marginBottom: "1.5rem", color: "#64748b", fontSize: "0.9rem" }}>
        Help us understand what kind of role and working style you are looking for. Some
        options may unlock additional questions.
      </p>

      {/* Schema-driven fields */}
      {rolePreferencesFields.map((field) => {
        const fieldError = errors[field.name];
        const errorMessage = fieldError?.message as string | undefined;

        const label = (
          <label
            htmlFor={field.name}
            style={{ display: "block", marginBottom: "0.3rem" }}
          >
            {field.label}
          </label>
        );

        return (
          <div style={{ marginBottom: "1rem" }} key={field.name}>
            {field.type !== "checkbox" && label}

            {field.type === "select" && (
              <select
                id={field.name}
                {...register(field.name, {
                  required:
                    field.name === "preferredRole" || field.name === "workLocationType"
                      ? "This field is required"
                      : false,
                })}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "white",
                }}
              >
                {(field.options || []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === "number" && (
              <input
                id={field.name}
                type="number"
                {...register(field.name, {
                  valueAsNumber: true,
                  min:
                    field.name === "expectedSalary"
                      ? {
                          value: 0,
                          message: "Salary must be 0 or greater",
                        }
                      : undefined,
                })}
                placeholder={field.placeholder}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                }}
              />
            )}

            {field.type === "textarea" && (
              <textarea
                id={field.name}
                {...register(field.name)}
                placeholder={field.placeholder}
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  resize: "vertical",
                }}
              />
            )}

            {field.type === "checkbox" && (
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <input id={field.name} type="checkbox" {...register(field.name)} />
                <span>{field.label}</span>
              </label>
            )}

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>
        );
      })}

      {/* Conditional Portfolio URLs */}
      {showPortfolioUrls && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            borderRadius: "10px",
            background: "#fefce8",
            border: "1px solid #facc15",
          }}
        >
          <p
            style={{
              marginTop: 0,
              marginBottom: "0.5rem",
              fontWeight: 500,
              color: "#92400e",
            }}
          >
            Portfolio URLs
          </p>
          <p
            style={{
              marginTop: 0,
              marginBottom: "0.8rem",
              fontSize: "0.85rem",
              color: "#78350f",
            }}
          >
            Since you have more than 3 years of React experience and prefer a Frontend
            role, please share links to your portfolio or key projects.
          </p>

          {fields.map((field, index) => (
            <div
              key={field.id}
              style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
            >
              <input
                {...register(`portfolioUrls.${index}.url` as const)}
                placeholder="https://example.com/my-react-project"
                style={{
                  flex: 1,
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                }}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                style={{
                  padding: "0.4rem 0.6rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#fee2e2",
                  cursor: fields.length === 1 ? "not-allowed" : "pointer",
                }}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ url: "" })}
            style={{
              marginTop: "0.5rem",
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              border: "none",
              background: "#22c55e",
              color: "white",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            + Add another URL
          </button>
        </div>
      )}

      <WizardNavigation back="/step/experience" next="/step/review" />
    </form>
  );
};
