import { ulid } from "@ulid";
import { type Profile } from "@protocol/profile.ts";
import { Connection } from "@api/data/connection.ts";

export const seed = async () => {
  const kv = await Connection.instance.getKv();

  const profile: Profile = {
    id: ulid(),
    type: "Individual",
    slug: "eser",
    title: "Eser Ozvataf",
    description: "",
    profilePictureUri: null,

    showStories: true,
    showMembers: false,

    links: undefined,
    pages: undefined,
  };

  await kv.set(["profile", "eser"], profile);
};

if (import.meta.main) {
  await seed();
}
