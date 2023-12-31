export type ProfileStoryCategory = "Status" | "Announcement" | "News";

export interface ProfileStory {
  id: string;
  slug: string;
  category: ProfileStoryCategory;
  isFeatured: boolean;

  title: string;
  content: string;

  publishedAt: string | null;
}
