// src/tests/testUtils.tsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { FormProvider } from "../context/FormContext";

interface RenderOptions {
  route?: string;
}

// Render a component wrapped with Router + FormProvider
export const renderWithProviders = (
  ui: React.ReactElement,
  options: RenderOptions = {}
) => {
  const { route = "/step/personal" } = options;
  window.history.pushState({}, "", route);

  return render(
    <BrowserRouter>
      <FormProvider>{ui}</FormProvider>
    </BrowserRouter>
  );
};
