// The fixed choices behind the admin's project "type" and "role" pickers.
// Stored as plain strings in the DB; the service rejects anything else, so
// these lists are the single source of truth.
export const PROJECT_TYPES = [
  "Website",
  "Landing Page",
  "E-commerce",
  "Web App",
  "Visual Identity",
  "Theme",
] as const;

export const ROLES = [
  "Art Director",
  "Designer",
  "Brand Designer",
  "Developer",
] as const;

/** Empty is allowed: the field is optional and hidden when unset. */
export function assertOneOf(
  value: string,
  options: readonly string[],
  label: string,
): void {
  if (value && !options.includes(value)) {
    throw new Error(`${label} "${value}" is not one of: ${options.join(", ")}`);
  }
}
