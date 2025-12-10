import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useFormContext } from "../../context/FormContext";

interface WizardLayoutProps {
  children: React.ReactNode;
}

/**
 * Compute dynamic progress based on:
 * - current route
 * - conditional visibility of sections (advanced experience, mentorship, portfolio)
 */
const useWizardProgress = () => {
  const location = useLocation();
  const { data } = useFormContext();

  const progress = useMemo(() => {
    const path = location.pathname;
    const { experience, rolePreferences } = data;

    const showAdvanced =
      typeof experience.yearsOfExperience === "number" &&
      experience.yearsOfExperience >= 2;

    const showMentorship =
      typeof experience.yearsOfExperience === "number" &&
      experience.yearsOfExperience !== null &&
      experience.yearsOfExperience < 2;

    const showPortfolio =
      rolePreferences.preferredRole === "frontend" &&
      typeof experience.reactYears === "number" &&
      experience.reactYears > 3;

    // Logical "units" of the wizard
    const units = [
      { id: "personal", active: true },
      { id: "expBase", active: true },
      { id: "expAdv", active: showAdvanced },
      { id: "expMentor", active: showMentorship },
      { id: "roleBase", active: true },
      { id: "portfolio", active: showPortfolio },
      { id: "review", active: true },
    ];

    const activeUnits = units.filter((u) => u.active);
    const total = activeUnits.length || 1;

    // For each route, which units should be considered "reached"?
    const unitsByPath: Record<string, string[]> = {
      "/step/personal": ["personal"],
      "/step/experience": ["personal", "expBase", "expAdv", "expMentor"],
      "/step/preferences": [
        "personal",
        "expBase",
        "expAdv",
        "expMentor",
        "roleBase",
        "portfolio",
      ],
      "/step/review": activeUnits.map((u) => u.id),
    };

    const reachedIds = unitsByPath[path] || ["personal"];
    const completed = activeUnits.filter((u) => reachedIds.includes(u.id)).length;

    const percent = Math.round((completed / total) * 100);

    return {
      percent,
      showAdvanced,
      showMentorship,
      showPortfolio,
    };
  }, [location.pathname, data]);

  return progress;
};

export const WizardLayout: React.FC<WizardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { setCurrentStep } = useFormContext();
  const { percent } = useWizardProgress();

  useEffect(() => {
    // Anytime the route changes, remember it as the current step for drafts
    setCurrentStep(location.pathname);
  }, [location.pathname, setCurrentStep]);

  const currentPath = location.pathname;

  const stepLabels = [
    { path: "/step/personal", label: "Personal Info" },
    { path: "/step/experience", label: "Experience" },
    { path: "/step/preferences", label: "Role Preferences" },
    { path: "/step/review", label: "Review & Submit" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f5f7fb",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <header
        style={{
          padding: "1rem 2rem",
          background: "#1e293b",
          color: "#f9fafb",
          boxShadow: "0 2px 4px rgba(15, 23, 42, 0.3)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
          Job Application – Adaptive Form Wizard
        </h1>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "2rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            background: "#ffffff",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          }}
        >
          {/* Progress bar */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.4rem",
                fontSize: "0.85rem",
                color: "#64748b",
              }}
            >
              <span>Progress</span>
              <span>{percent}% complete</span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 999,
                background: "#e2e8f0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: "#4f46e5",
                  transition: "width 0.25s ease",
                }}
              />
            </div>

            {/* Step pills */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0.6rem",
                gap: "0.5rem",
                fontSize: "0.75rem",
              }}
            >
              {stepLabels.map((step) => {
                const isActive = step.path === currentPath;
                return (
                  <div
                    key={step.path}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "0.25rem 0.5rem",
                      borderRadius: 999,
                      background: isActive ? "#e0e7ff" : "transparent",
                      color: isActive ? "#1d4ed8" : "#64748b",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {step.label}
                  </div>
                );
              })}
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
};
