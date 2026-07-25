export interface MediaType {
  url: string;
  alt: string;
  /** Static image to show in place of a video (e.g. in the gallery minimap). */
  poster?: string;
}

export interface ProjectType {
  name: string;
  slug: string;
  type: string;
  labels: string[];
  description: string;
  year: string;
  role: string;
  image: MediaType;
  gallery?: MediaType[];
  works: {
    horizontal?: boolean;
  };
}
