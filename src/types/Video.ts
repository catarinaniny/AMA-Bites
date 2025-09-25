export interface Video {
  id: string;
  title: string;
  category: VideoCategory;
  fileName: string;
  uploadedAt: string;
}

export type VideoCategory =
  | "ACP Framework"
  | "Business Strategy"
  | "Lead Generation"
  | "Social Media & Content Creation"
  | "Tech & AI";

export const CATEGORIES: VideoCategory[] = [
  "ACP Framework",
  "Business Strategy",
  "Lead Generation",
  "Social Media & Content Creation",
  "Tech & AI"
];