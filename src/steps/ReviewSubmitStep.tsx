import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { WizardNavigation } from "../components/Wizard/WizardNavigation";

import { DRAFT_STORAGE_KEY } from "../utils/storageKeys";

export const ReviewSubmitStep: React.FC = () => {
  const { data, resetForm } = useFormContext();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    setHasSubmitted(false);

    // Simulated async submission – in a real app this would be an API call.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setHasSubmitted(true);

    // Optionally clear any draft from localStorage after "submission"
    try {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  };

  const handleReset = () => {
    resetForm();
    try {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
    navigate("/step/personal");
  };

  const { personalInfo, experience, rolePreferences } = data;

  const hasPortfolio =
    rolePreferences.portfolioUrls &&
    rolePreferences.portfolioUrls.length > 0;

  const safeValue = (value: unknown): string => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: "0.5rem" }}>Review & Submit</h2>
      <p style={{ marginBottom: "1.5rem", color: "#64748b", fontSize: "0.9rem" }}>
        Please review your application before submitting. You can go back to any
        step to make changes.
      </p>

      {/* Personal Info Card */}
      <section
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          borderRadius: "10px",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1rem" }}>
          Personal Information
        </h3>
        <div style={{ fontSize: "0.9rem", color: "#0f172a" }}>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Full Name:</strong> {safeValue(personalInfo.fullName)}
          </div>
          <div>
            <strong>Email:</strong> {safeValue(personalInfo.email)}
          </div>
        </div>
      </section>

      {/* Experience Card */}
      <section
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          borderRadius: "10px",
          background: "#f1f5f9",
          border: "1px solid #cbd5f5",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1rem" }}>
          Experience
        </h3>
        <div style={{ fontSize: "0.9rem", color: "#0f172a" }}>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Years of Experience:</strong>{" "}
            {safeValue(experience.yearsOfExperience)}
          </div>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Current Role:</strong> {safeValue(experience.currentRole)}
          </div>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Primary Tech Stack:</strong>{" "}
            {safeValue(experience.primaryTechStack)}
          </div>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>React Experience (years):</strong>{" "}
            {safeValue(experience.reactYears)}
          </div>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Team Lead Experience:</strong>{" "}
            {safeValue(experience.teamLeadExperience)}
          </div>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Mentorship Required:</strong>{" "}
            {safeValue(experience.mentorshipRequired)}
          </div>
          {experience.summary && (
            <div style={{ marginTop: "0.5rem" }}>
              <strong>Summary:</strong>
              <div>{experience.summary}</div>
            </div>
          )}
        </div>
      </section>

      {/* Role Preferences Card */}
      <section
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          borderRadius: "10px",
          background: "#fefce8",
          border: "1px solid #facc15",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1rem" }}>
          Role Preferences
        </h3>
        <div style={{ fontSize: "0.9rem", color: "#0f172a" }}>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Preferred Role:</strong>{" "}
            {safeValue(rolePreferences.preferredRole)}
          </div>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Work Mode:</strong>{" "}
            {safeValue(rolePreferences.workLocationType)}
          </div>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Expected Salary:</strong>{" "}
            {safeValue(rolePreferences.expectedSalary)}
          </div>
          <div style={{ marginBottom: "0.25rem" }}>
            <strong>Open to Relocation:</strong>{" "}
            {safeValue(rolePreferences.openToRelocation)}
          </div>

          {hasPortfolio && (
            <div style={{ marginTop: "0.5rem" }}>
              <strong>Portfolio URLs:</strong>
              <ul style={{ paddingLeft: "1.2rem", marginTop: "0.25rem" }}>
                {rolePreferences.portfolioUrls.map((url, index) => (
                  <li key={`${url}-${index}`}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#2563eb", textDecoration: "underline" }}
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {rolePreferences.notes && (
            <div style={{ marginTop: "0.5rem" }}>
              <strong>Notes:</strong>
              <div>{rolePreferences.notes}</div>
            </div>
          )}
        </div>
      </section>

      {/* Submit + Reset Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1.5rem",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* Left: Reset */}
        <button
          type="button"
          onClick={handleReset}
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            border: "none",
            background: "#e11d48",
            color: "#f9fafb",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Reset Application
        </button>

        {/* Right: Submit + Back */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              border: "none",
              background: isSubmitting ? "#93c5fd" : "#2563eb",
              color: "white",
              cursor: isSubmitting ? "wait" : "pointer",
              fontWeight: 500,
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </div>

      {hasSubmitted && (
        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.9rem",
            color: "#16a34a",
            fontWeight: 500,
          }}
        >
          ✅ Application submitted (mock). We’ll discuss this flow during the
          interview.
        </p>
      )}

      {/* Back navigation (to previous step) */}
      <div style={{ marginTop: "1rem" }}>
        <WizardNavigation back="/step/preferences" />
      </div>
    </form>
  );
};
