export interface ProjectTypes {
  title: string;
  url: string;
  cover: string;
  info: {
    [key: string]: string | number;
  };
  description_short: string;
  description_full: string;
  live_preview?: string;
  technologies?: [
    {
      name: string;
      url: string;
    },
  ];
  images: string[];
  related: string[];
}
