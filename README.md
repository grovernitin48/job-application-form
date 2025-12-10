Below is a **clean, crisp, and updated README** based on your new architecture, reusable components, async validation, and full production cleanup.

---

# 📘 Adaptive Job Application Form Wizard

**React + TypeScript · Zod Validation · Dynamic Schema · Autosave Drafts · Async Validation · RTL Tests**

A production-style, multi-step job application wizard showcasing **schema-driven forms**, **dynamic conditional sections**, **autosave with resume**, **async validation**, reusable UI components, and clear architectural separation.

Built for an offline frontend coding exercise emphasizing **design**, **state management**, **code quality**, and **real-world patterns**.

---

# 🚀 Features

### 🧭 Multi-Step Wizard

1. **Personal Info**
2. **Experience**
3. **Role Preferences**
4. **Review & Submit**

Includes:

* Back / Next navigation
* Per-step validation
* Reset button on every step
* Last visited step restored from localStorage

---

### 🔧 Dynamic Schema-Driven Behaviour

All dynamic fields and logic come from **typed schemas** (Experience + Role).

#### **Experience Step**

* If **Experience < 2 years** → Hide advanced fields, show **Mentorship Required**.
* If **Experience ≥ 2 years** → Show advanced fields (React Years, Summary, Lead Experience).

#### **Role Preferences Step**

* If **Preferred Role = Frontend** AND **React Experience > 3** →
  Show repeatable **Portfolio URLs** using `useFieldArray`.

---

### 💾 Auto-Save Drafts (Offline Resume)

* Every change is autosaved via `watch()` → `FormContext` → `localStorage`.
* Full form state + current step restore on reload.
* **Reset Application** clears drafts and sends user to Step 1.

---

### 📊 Dynamic Progress Indicator

Progress is based on **visible sections**, not fixed steps:

* Personal Info
* Base Experience
* Advanced Experience (conditional)
* Mentorship (conditional)
* Base Role Preferences
* Portfolio URLs (conditional)
* Review

Irrelevant sections are automatically excluded from progress %.

---

### 🌐 Async Validation (Personal Info)

Simulated API validation for **email uniqueness**:

* Any email containing `"test"` is marked as already taken.
* Shown after Zod validation (email format check).
* Displays **"Checking email..."** while validating.

---

### 🛡️ Strong Validation with Zod

Each step uses its own schema:

* `personalInfoSchema`
* `experienceSchema`
* `rolePreferencesSchema`

Integrated through `zodResolver` for:

* Consistent validation
* Typed form values
* Cleaner UI-logic separation

---

# 🧱 Required Fields Summary

### Personal Info

| Field    | Required | Notes                          |
| -------- | -------- | ------------------------------ |
| fullName | ✅        | Min 2 chars                    |
| email    | ✅        | Valid email + async uniqueness |

### Experience

| Field              | Required | Notes                 |
| ------------------ | -------- | --------------------- |
| yearsOfExperience  | ✅        | Drives dynamic fields |
| currentRole        | ✅        | —                     |
| primaryTechStack   | ✅        | —                     |
| reactYears         | ⛔        | Advanced only         |
| teamLeadExperience | ⛔        | Advanced only         |
| summary            | ⛔        | Advanced only         |
| mentorshipRequired | ⛔        | For <2 years only     |

### Role Preferences

| Field            | Required | Notes                                |
| ---------------- | -------- | ------------------------------------ |
| preferredRole    | ✅        | Enum                                 |
| workLocationType | ✅        | Enum                                 |
| expectedSalary   | ⛔        | Optional number                      |
| openToRelocation | ⛔        | Boolean                              |
| portfolioUrls    | ⛔        | Only for (frontend + reactYears > 3) |
| notes            | ⛔        | Optional text                        |

---

# 🔁 Logical Flow Diagram

```text
Personal Info
   |
   v
Experience
   |-- if years < 2:
   |        show Mentorship Required
   |
   |-- if years >= 2:
   |        show Advanced Fields
   |
   v
Role Preferences
   |-- if preferredRole = frontend AND reactYears > 3:
   |        show Portfolio URLs
   |
   v
Review & Submit
   |-- Back
   |-- Reset (clear drafts)
   |-- Submit (simulated)
```

---

# 🗂️ Project Structure (Updated)

```
src/
  components/
    ui/
      Button.tsx
      TextField.tsx
      TextAreaField.tsx
      CheckboxField.tsx
      SelectField.tsx
    Wizard/
      WizardNavigation.tsx
    Layout/
      WizardLayout.tsx

  context/
    FormContext.tsx

  validation/
    jobApplicationSchemas.ts     # Zod schemas + types

  schemas/
    experienceSchema.ts          # Field config
    rolePreferencesSchema.ts     # Field config

  steps/
    PersonalInfoStep.tsx
    ExperienceStep.tsx
    RolePreferencesStep.tsx
    ReviewSubmitStep.tsx

  tests/
    PersonalInfoStep.test.tsx
    ExperienceStep.test.tsx
    RolePreferencesStep.test.tsx (skipped)

  styles/
    main.css

  App.tsx
  main.tsx
```

---

# 🧪 Testing

### Tech

* Vitest
* React Testing Library
* happy-dom
* jest-dom matchers

### Status

| Step             | What is tested       | Status     |
| ---------------- | -------------------- | ---------- |
| Personal Info    | Async validation     | ✅          |
| Experience       | Conditional sections | ✅          |
| Role Preferences | Portfolio logic      | ⚠️ skipped |

Run tests:

```bash
npm run test
```

---

# 🧹 Linting & Formatting

* ESLint (flat config)
* react-hooks rules
* TypeScript rules
* Prettier on save

Commands:

```bash
npm run lint
npm run lint:fix
npm run format
```

---

# 📦 Running Locally

### 1. Clone Repo

```bash
git clone https://github.com/grovernitin48/job-application-wizard.git
cd job-application-wizard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Dev Server

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

### 4. Run Tests

```bash
npm run test
```

---

# 🌐 CodeSandbox Link

Go to **[job-application-form](https://codesandbox.io/p/sandbox/github/grovernitin48/job-application-form)**
