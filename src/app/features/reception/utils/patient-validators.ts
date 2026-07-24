// Shared validation helpers for the Patient module (Register + Update).
// Centralized here (alongside appointment-slots.ts) so both components use
// the exact same rules instead of duplicating regex/logic.

// ---- Patterns ----------------------------------------------------------

// Letters and single spaces only (no leading requirement enforced here -
// "required" is handled separately by the template's `required` attribute)
export const NAME_PATTERN = /^[A-Za-z ]+$/;

// Exactly 10 digits
export const PHONE_PATTERN = /^[0-9]{10}$/;

export const MAX_NAME_LENGTH = 30;
export const MAX_ADDRESS_LENGTH = 200;
export const PHONE_LENGTH = 10;
export const MIN_AGE = 0;
export const MAX_AGE = 120;

// ---- Keystroke blockers (stop invalid characters before they're typed) --

// Allow only letters and space while typing (also allows control/navigation
// keys like Backspace, Delete, Arrow keys, Tab, which have key.length > 1)
export function blockNonAlphaKey(event: KeyboardEvent): void {
  if (event.key.length === 1 && !/^[A-Za-z ]$/.test(event.key)) {
    event.preventDefault();
  }
}

// Allow only digits while typing
export function blockNonNumericKey(event: KeyboardEvent): void {
  if (event.key.length === 1 && !/^[0-9]$/.test(event.key)) {
    event.preventDefault();
  }
}

// ---- Sanitizers (safety net for paste / autofill) ----------------------

export function sanitizeAlpha(value: string | null | undefined, maxLen: number = MAX_NAME_LENGTH): string {
  if (!value) return '';
  return value.replace(/[^A-Za-z ]/g, '').slice(0, maxLen);
}

export function sanitizeDigits(value: string | null | undefined, maxLen: number = PHONE_LENGTH): string {
  if (!value) return '';
  return value.replace(/[^0-9]/g, '').slice(0, maxLen);
}

export function trimValue(value: string | null | undefined): string {
  return (value ?? '').trim();
}

// ---- Age calculation (from Date of Birth) -------------------------------

export function calculateAge(dobStr: string | null | undefined): number {
  if (!dobStr) return 0;

  const dob = new Date(dobStr);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  const birthdayNotYetHappened =
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());

  if (birthdayNotYetHappened) {
    age--;
  }

  return age;
}