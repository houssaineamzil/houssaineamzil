// The fixed choices behind the admin's project "type" and "roles" pickers.
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

export type ProjectKind = (typeof PROJECT_TYPES)[number];
export type Role = (typeof ROLES)[number];
