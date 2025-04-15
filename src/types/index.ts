export interface CardType {
  id: string;
  uid?: string;
  _variant: string | "small" | "square" | "medium";
  _type: string | "about" | "clients" | "services" | "work";
  title?: string;
  description?: string;
  background?: {
    _type: string | "image" | "video";
    url: string;
  };
  tag: string[];
}
