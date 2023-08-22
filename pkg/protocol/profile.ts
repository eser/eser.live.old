import { type ProfileLink } from "./profile-link.ts";
import { type ProfilePage } from "./profile-page.ts";

export type ProfileType = "Individual" | "Organization" | "Product" | "Venue";

export type Profile = {
  id: string;
  type: ProfileType;
  slug: string;
  title: string;
  description: string;
  profilePictureUri: string | null;

  showStories: boolean;
  showMembers: boolean;

  links: Array<ProfileLink> | undefined;
  pages: Array<ProfilePage> | undefined;
  // stories: Array<ProfileStory> | undefined;
};
