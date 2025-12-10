import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import { Button } from "../components/ui/Button";

export const ReviewSubmitStep: React.FC = () => {
  const { data, resetForm } = useFormContext();
  const navigate = useNavigate();

  const { personalInfo, experience, rolePreferences } = data;

  const handleSubmit = () => {
    // In a real app, this is where we'd call an API.
    // For this exercise, we just log the payload and pretend it's submitted.

    console.log("Submitting application payload:", data);

    alert("Application submitted! (simulated)");
  };

  const handleReset = () => {
    if (window.confirm("This will clear your draft and start over. Continue?")) {
      resetForm();
      navigate("/step/personal");
    }
  };

  const formatYears = (value: number | null | undefined) => {
    if (value == null) return "—";
    return `${value} year${value === 1 ? "" : "s"}`;
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return "Not specified";
    return value.toLocaleString();
  };

  const portfolioUrls = rolePreferences.portfolioUrls ?? [];

  return (
    <div className="form-step">
      <h2 className="form-step__title">Review &amp; Submit</h2>
      <p className="form-step__subtitle">
        Please review your information before submitting. You can go back to adjust any
        step, or reset the application to start over.
      </p>

      <div className="review-grid">
        {/* Personal Info */}
        <section className="review-card">
          <h3 className="review-card__title">Personal Info</h3>
          <ul className="review-card__list">
            <li className="review-card__item">
              <span className="review-card__label">Full Name</span>
              <span className="review-card__value">
                {personalInfo.fullName || "Not provided"}
              </span>
            </li>
            <li className="review-card__item">
              <span className="review-card__label">Email</span>
              <span className="review-card__value">
                {personalInfo.email || "Not provided"}
              </span>
            </li>
          </ul>
        </section>

        {/* Experience */}
        <section className="review-card">
          <h3 className="review-card__title">Experience</h3>
          <ul className="review-card__list">
            <li className="review-card__item">
              <span className="review-card__label">Total Experience</span>
              <span className="review-card__value">
                {formatYears(experience.yearsOfExperience)}
              </span>
            </li>
            <li className="review-card__item">
              <span className="review-card__label">Current Role</span>
              <span className="review-card__value">
                {experience.currentRole || "Not provided"}
              </span>
            </li>
            <li className="review-card__item">
              <span className="review-card__label">Primary Stack</span>
              <span className="review-card__value">
                {experience.primaryTechStack || "Not provided"}
              </span>
            </li>
            <li className="review-card__item">
              <span className="review-card__label">React Experience</span>
              <span className="review-card__value">
                {formatYears(experience.reactYears ?? null)}
              </span>
            </li>
            <li className="review-card__item">
              <span className="review-card__label">Team Lead</span>
              <span className="review-card__value">
                {experience.teamLeadExperience ? "Yes" : "No"}
              </span>
            </li>
            <li className="review-card__item">
              <span className="review-card__label">Mentorship Required</span>
              <span className="review-card__value">
                {experience.mentorshipRequired ? "Yes" : "No"}
              </span>
            </li>
          </ul>
        </section>

        {/* Role Preferences */}
        <section className="review-card">
          <h3 className="review-card__title">Role Preferences</h3>
          <ul className="review-card__list">
            <li className="review-card__item">
              <span className="review-card__label">Preferred Role</span>
              <span className="review-card__value">
                {rolePreferences.preferredRole || "Not specified"}
              </span>
            </li>
            <li className="review-card__item">
              <span className="review-card__label">Work Mode</span>
              <span className="review-card__value">
                {rolePreferences.workLocationType || "Not specified"}
              </span>
            </li>
            <li className="review-card__item">
              <span className="review-card__label">Expected Salary</span>
              <span className="review-card__value">
                {formatCurrency(rolePreferences.expectedSalary ?? null)}
              </span>
            </li>
            <li className="review-card__item">
              <span className="review-card__label">Open to Relocation</span>
              <span className="review-card__value">
                {rolePreferences.openToRelocation ? "Yes" : "No"}
              </span>
            </li>
          </ul>
        </section>

        {/* Notes & Portfolio */}
        <section className="review-card">
          <h3 className="review-card__title">Additional Notes &amp; Portfolio</h3>
          <ul className="review-card__list">
            <li className="review-card__item">
              <span className="review-card__label">Notes</span>
              <span className="review-card__value">
                {rolePreferences.notes?.trim() || "None"}
              </span>
            </li>
          </ul>

          {portfolioUrls.length > 0 && (
            <>
              <p className="form-field__helper">Portfolio URLs:</p>
              <ul className="review-portfolio-list">
                {portfolioUrls.map((item, index) => (
                  <li key={`${item.url}-${index}`}>{item.url}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      {/* Actions */}
      <div className="review-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/step/preferences")}
        >
          Back
        </Button>

        <div className="review-actions__right">
          <Button type="button" variant="ghost" onClick={handleReset}>
            Reset
          </Button>
          <Button type="button" variant="primary" onClick={handleSubmit}>
            Submit Application
          </Button>
        </div>
      </div>
    </div>
  );
};
