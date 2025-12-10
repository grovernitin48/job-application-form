import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { WizardNavigation } from "../components/Wizard/WizardNavigation";
import { validateEmailUniqueness } from "../utils/validateEmail";

interface PersonalInfoFormValues {
  fullName: string;
  email: string;
}

export const PersonalInfoStep: React.FC = () => {
  const { data, updateForm } = useFormContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<PersonalInfoFormValues>({
    mode: "onBlur",
    defaultValues: data.personalInfo,
  });

  useEffect(() => {
    const subscription = watch((values) => {
      updateForm({
        personalInfo: {
          ...data.personalInfo,
          ...values,
        },
      });
    });

    return () => subscription.unsubscribe();
  }, [watch, updateForm, data.personalInfo]);

  const onSubmit = async (values: PersonalInfoFormValues) => {
    updateForm({ personalInfo: values });
    navigate("/step/experience");
  };

  const emailValue = watch("email");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 style={{ marginBottom: "1rem" }}>Personal Information</h2>

      {/* Full Name */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="fullName" style={{ display: "block", marginBottom: "0.3rem" }}>
          Full Name
        </label>
        <input
          id="fullName"
          {...register("fullName", { required: "Full name is required" })}
          style={{
            width: "100%",
            padding: "0.6rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
          }}
        />
        {errors.fullName && <p style={{ color: "red" }}>{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="email" style={{ display: "block", marginBottom: "0.3rem" }}>
          Email
        </label>
        <input
          id="email"
          {...register("email", {
            required: "Email is required",
            validate: {
              unique: async (value) => {
                const ok = await validateEmailUniqueness(value);
                return ok || "Email already exists, try another.";
              },
            },
          })}
          style={{
            width: "100%",
            padding: "0.6rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
          }}
        />
        {isSubmitting && emailValue && (
          <p style={{ color: "#2563eb", marginTop: "0.3rem" }}>Checking email...</p>
        )}
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
      </div>

      {/* Navigation */}
      <WizardNavigation next="/step/experience" />
    </form>
  );
};
