import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFormContext } from "../context/FormContext";
import {
  personalInfoSchema,
  type PersonalInfoFormValues,
} from "../validation/jobApplicationSchemas";
import { TextField } from "../components/ui/TextField";
import { WizardNavigation } from "../components/Wizard/WizardNavigation";

// Simulated async uniqueness check: any email containing "test" is rejected
const validateEmailUniqueness = async (email: string): Promise<boolean> => {
  if (!email) return true;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Reject emails that contain "test"
  return !email.toLowerCase().includes("test");
};

export const PersonalInfoStep: React.FC = () => {
  const { data, updateForm } = useFormContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormValues>({
    mode: "onBlur",
    resolver: zodResolver(personalInfoSchema) as any,
    defaultValues: {
      fullName: data.personalInfo.fullName ?? "",
      email: data.personalInfo.email ?? "",
    },
  });

  // Watch only the email field for helper text
  const emailValue = watch("email");

  // ✅ Autosave using a subscription to watch() (typed via `as any` to avoid TS overload error)
  useEffect(() => {
    const subscription = (watch as any)((values: PersonalInfoFormValues) => {
      updateForm({
        personalInfo: {
          ...data.personalInfo,
          ...values,
        },
      });
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, [watch, updateForm, data.personalInfo]);

  const onSubmit = async (values: PersonalInfoFormValues) => {
    // Clear old email errors first
    clearErrors("email");

    // Run async "API" uniqueness check
    const ok = await validateEmailUniqueness(values.email);

    if (!ok) {
      setError("email", {
        type: "validate",
        message: "Email already exists, try another.",
      });
      return; // Do NOT navigate if email is not unique
    }

    // If everything (Zod + async) passed, go to next step
    navigate("/step/experience");
  };

  const handleResetStep = () => {
    reset({
      fullName: "",
      email: "",
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="form-step" noValidate>
      <h2 className="form-step__title">Personal Info</h2>
      <p className="form-step__subtitle">
        Tell us how we can reach you. We also simulate an async email check to validate
        uniqueness.
      </p>

      <TextField
        id="fullName"
        label="Full Name"
        error={errors.fullName?.message}
        {...register("fullName", { required: "Full name is required" })}
      />

      <TextField
        id="email"
        label="Email"
        error={errors.email?.message}
        helperText={isSubmitting && emailValue ? "Checking email..." : undefined}
        {...register("email", {
          required: "Email is required",
        })}
      />

      {/* WizardNavigation gives you Reset + Next automatically */}
      <WizardNavigation next="/step/experience" onResetStep={handleResetStep} />
    </form>
  );
};
