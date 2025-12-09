// src/utils/validateEmail.ts

export const validateEmailUniqueness = async (email: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Reject emails with "test" in them (sample rule)
      if (email.toLowerCase().includes("test")) resolve(false);
      else resolve(true);
    }, 800); // simulated network delay
  });
};
