// src/tests/ExperienceStep.test.tsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExperienceStep } from "../steps/ExperienceStep";
import { renderWithProviders } from "./testUtils";

describe("ExperienceStep", () => {
  it("shows mentorship toggle and hides advanced fields when years < 2", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExperienceStep />, { route: "/step/experience" });

    const yearsInput = screen.getByLabelText(/total years of experience/i);

    await user.clear(yearsInput);
    await user.type(yearsInput, "1");

    // Advanced fields should not be in the document
    expect(
      screen.queryByLabelText(/react experience \(years\)/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/have you led a team before/i)
    ).not.toBeInTheDocument();

    // Mentorship card visible
    expect(screen.getByText(/early-career support/i)).toBeInTheDocument();
    expect(screen.getByText(/mentorship required\?/i)).toBeInTheDocument();
  });

  it("shows advanced fields and hides mentorship when years >= 2", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExperienceStep />, { route: "/step/experience" });

    const yearsInput = screen.getByLabelText(/total years of experience/i);

    await user.clear(yearsInput);
    await user.type(yearsInput, "3");

    // Advanced fields should appear
    expect(screen.getByLabelText(/react experience \(years\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/have you led a team before\?/i)).toBeInTheDocument();

    // Mentorship card should be hidden
    expect(screen.queryByText(/early-career support/i)).not.toBeInTheDocument();
  });
});
