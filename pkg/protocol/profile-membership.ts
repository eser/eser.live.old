import { type User } from "./user.ts";

export type ProfileMembershipRole =
  | "Owner"
  | "Lead"
  | "Maintainer"
  | "Contributor"
  | "Sponsor"
  | "Follower";

export interface ProfileMembership {
  id: string;
  role: ProfileMembershipRole;
  user: User | null;
}
