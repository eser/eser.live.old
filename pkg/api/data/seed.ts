import { ulid } from "$ulid/mod.ts";
import { type ProfileEntity } from "$protocol/profile.ts";
import { Connection } from "$api/data/connection.ts";

export const seed = async () => {
  const kv = await Connection.instance.getKv();

  const profile: ProfileEntity = {
    id: ulid(),
    type: "Individual",
    slug: "eser",
    profilePictureUri: null,

    tx: {
      tr: {
        title: "Eser Ozvataf",
        description: "",
      },
    },

    showStories: true,
    showMembers: false,
  };

  await kv.set(["profile", "eser"], profile);
};

if (import.meta.main) {
  await seed();
}
