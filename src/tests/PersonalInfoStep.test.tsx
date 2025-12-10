import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PersonalInfoStep } from "../steps/PersonalInfoStep";
import { renderWithProviders } from "./testUtils";

describe("PersonalInfoStep", () => {
  it("shows async validation error when email contains 'test'", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "test@example.com");

    // Trigger blur so validation runs (mode: "onBlur")
    emailInput.blur();

    // Wait for async validator (validateEmailUniqueness) to finish
    const error = await screen.findByText(/email already exists, try another/i);
    expect(error).toBeInTheDocument();
  });

  it("does not show async validation error for a valid email", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PersonalInfoStep />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "real@example.com");

    // Trigger blur so validation runs
    emailInput.blur();

    // Give validation some time, then assert the error is not present
    await waitFor(() => {
      expect(
        screen.queryByText(/email already exists, try another/i)
      ).not.toBeInTheDocument();
    });
  });
});
