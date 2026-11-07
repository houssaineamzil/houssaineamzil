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
  type: string;
  labels: string[];
  description: string;
  year: string;
  role: string;
  /** Short outcome shown as a chip on the project image, e.g. "+30% conversion". Empty = no chip. */
  result?: string;
  image: MediaType;
  gallery?: MediaType[];
  works: {
    horizontal?: boolean;
  };
}
