import { type ProfileLink } from "./profile-link.ts";
import { type ProfilePage } from "./profile-page.ts";
import { type LanguageCode } from "./languages.ts";

export type ProfileType = "Individual" | "Organization" | "Product" | "Venue";

export interface ProfileTx {
  title: string;
  description: string;
}

export interface ProfileEntity {
  id: string;
  type: ProfileType;
  slug: string;
  profilePictureUri: string | null;

  tx: Partial<Record<LanguageCode, ProfileTx>>;

  showStories: boolean;
  showMembers: boolean;
}

export interface Profile extends Omit<ProfileEntity, "tx">, ProfileTx {
  links: Array<ProfileLink> | undefined;
  pages: Array<ProfilePage> | undefined;
  // stories: Array<ProfileStory> | undefined;
}
