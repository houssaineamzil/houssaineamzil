export interface MediaType {
  url: string;
  alt: string;
  /** Static image to show in place of a video (e.g. in the gallery minimap). */
  poster?: string;
}

export interface ProjectType {
  id?: string;
  name: string;
  slug: string;
  description: string;
  /** Optional case-study sections; empty string hides the section. */
  strategy: string;
  result: string;
  impact: string;
  year: string;
  /** One of ROLES (src/lib/projectOptions.ts), or empty. */
  role: string;
  /** One of PROJECT_TYPES, or empty. */
  projectType: string;
  /** Live site or case-study link; empty hides it. */
  url: string;
  /** Optional names of collaborators who designed / built part of it. */
  designer: string;
  developer: string;
  image: MediaType;
  gallery: MediaType[];
  /** Wide card in the works grid. */
  horizontal: boolean;
}

/** What a project card needs: sent to the client instead of the whole project. */
export type ProjectSummary = Pick<
  ProjectType,
  "slug" | "name" | "projectType" | "image"
>;

/** A project as stored: always has its database id. */
export type StoredProject = ProjectType & { id: string };
