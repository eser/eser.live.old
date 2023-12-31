import { type Profile } from "./profile.ts";

export interface User {
  id: string;
  // email: string;
  fullname: string;
  bio: string;
  profilePictureUri: string | null;
  githubHandle: string;
  twitterHandle: string;

  individualProfile: Profile | null;
}
