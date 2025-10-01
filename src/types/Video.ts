export interface Video {
  id: string;
  title: string;
  categories: VideoCategory[];
  date: string;
  youtubeUrl: string;
  youtubeId: string;
  uploadedAt: string;
}

export type VideoCategory =
  | "ACP Framework"
  | "Business Strategy"
  | "Lead Generation"
  | "Marketing & Growth"
  | "Social Media & Content Creation"
  | "Tech & AI";

export const CATEGORIES: VideoCategory[] = [
  "ACP Framework",
  "Business Strategy",
  "Lead Generation",
  "Marketing & Growth",
  "Social Media & Content Creation",
  "Tech & AI"
];