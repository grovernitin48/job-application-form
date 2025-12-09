import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { experienceFields } from "../schemas/experienceSchema";
import type { ExperienceFormValues } from "../schemas/experienceSchema";

import { WizardNavigation } from "../components/Wizard/WizardNavigation";

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
    defaultValues: data.experience,
  });

  // We watch yearsOfExperience so we can:
  // - show/hide advanced fields
  // - show "Mentorship Required?" when < 2 years
  const yearsOfExperience = watch("yearsOfExperience");

  const showAdvanced =
    typeof yearsOfExperience === "number" && yearsOfExperience >= 2;

  const showMentorshipToggle =
    typeof yearsOfExperience === "number" &&
    yearsOfExperience !== null &&
    yearsOfExperience < 2;

  const onSubmit = (values: ExperienceFormValues) => {
    updateForm({ experience: values });
    navigate("/step/preferences");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 style={{ marginBottom: "0.5rem" }}>Experience</h2>
      <p style={{ marginBottom: "1.5rem", color: "#64748b", fontSize: "0.9rem" }}>
        Tell us about your background. Some advanced questions depend on how many
        years of experience you have.
      </p>

      {experienceFields.map((field) => {
        // Years of experience and other base fields are always visible.
        // Advanced fields (isAdvanced) are hidden if yearsOfExperience < 2.
        if (field.isAdvanced && !showAdvanced) {
          return null;
        }

        const commonLabel = (
          <label
            htmlFor={field.name}
            style={{ display: "block", marginBottom: "0.3rem" }}
          >
            {field.label}
          </label>
        );

        const errorMessage = (errors as any)[field.name]?.message as
          | string
          | undefined;

        return (
          <div style={{ marginBottom: "1rem" }} key={field.name as string}>
            {field.type !== "checkbox" && commonLabel}

            {/* Render based on type */}
            {field.type === "text" && (
              <input
                id={field.name}
                {...register(field.name, {
                  required:
                    field.name === "currentRole"
                      ? "Current role is required"
                      : false,
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

            {field.type === "number" && (
              <input
                id={field.name}
                type="number"
                {...register(field.name, {
                  valueAsNumber: true,
                  required:
                    field.name === "yearsOfExperience"
                      ? "Years of experience is required"
                      : false,
                  min:
                    field.name === "yearsOfExperience"
                      ? { value: 0, message: "Must be 0 or greater" }
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
                <input
                  id={field.name}
                  type="checkbox"
                  {...register(field.name)}
                />
                <span>{field.label}</span>
              </label>
            )}

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>
        );
      })}

      {/* Mentorship Required Toggle – only if < 2 years of experience */}
      {showMentorshipToggle && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            borderRadius: "10px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
          }}
        >
          <p
            style={{
              marginTop: 0,
              marginBottom: "0.5rem",
              fontWeight: 500,
              color: "#1d4ed8",
            }}
          >
            Early-career support
          </p>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              {...register("mentorshipRequired")}
            />
            <span>Mentorship required?</span>
          </label>
          <p style={{ marginTop: "0.4rem", fontSize: "0.8rem", color: "#475569" }}>
            Since you have less than 2 years of experience, we can match you with
            a mentor.
          </p>
        </div>
      )}

      <WizardNavigation back="/step/personal" next="/step/preferences" />
    </form>
  );
};
