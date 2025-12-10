import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useFormContext } from "../../context/FormContext";

interface WizardLayoutProps {
  children: React.ReactNode;
}

const useWizardProgress = () => {
  const location = useLocation();
  const { data } = useFormContext();

  return useMemo(() => {
    const path = location.pathname;
    const { experience, rolePreferences } = data;

    const showAdvanced =
      typeof experience.yearsOfExperience === "number" &&
      experience.yearsOfExperience >= 2;

    const showMentorship =
      typeof experience.yearsOfExperience === "number" &&
      experience.yearsOfExperience !== null &&
      experience.yearsOfExperience > 0 &&
      experience.yearsOfExperience < 2;

    const showPortfolio =
      rolePreferences.preferredRole === "frontend" &&
      typeof experience.reactYears === "number" &&
      experience.reactYears > 3;

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

    return { percent };
  }, [location.pathname, data]);
};

export const WizardLayout: React.FC<WizardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { setCurrentStep } = useFormContext();
  const { percent } = useWizardProgress();

  useEffect(() => {
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
    <div className="app">
      <div className="app__shell">
        <header className="app__header">
          <h1 className="app__header-title">Job Application – Adaptive Form Wizard</h1>
        </header>

        <main className="app__main">
          <section className="wizard">
            <div className="wizard__progress">
              <div className="wizard__progress-header">
                <span>Progress</span>
                <span>{percent}% complete</span>
              </div>
              <div className="wizard__progress-track">
                <div className="wizard__progress-bar" style={{ width: `${percent}%` }} />
              </div>

              <div className="wizard__steps">
                {stepLabels.map((step) => {
                  const isActive = step.path === currentPath;
                  return (
                    <div
                      key={step.path}
                      className={
                        "wizard__step-pill" +
                        (isActive ? " wizard__step-pill--active" : "")
                      }
                    >
                      {step.label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="wizard__content">{children}</div>
          </section>
        </main>
      </div>
    </div>
  );
};
