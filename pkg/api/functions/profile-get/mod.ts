import { z } from "@zod";
import { type Profile } from "@protocol/profile.ts";
import { type ProfileGetResult } from "@protocol/profile-get-result.ts";
import { Connection } from "@api/data/connection.ts";

export const profileGet = async (
  slug: string,
  lang: string,
) => {
  const kv = await Connection.instance.getKv();

  const slugValidated = await z.string().parseAsync(slug);

  const profile = await kv.get<Profile>(["profile", slugValidated]);

  if (profile.value === null) {
    const result: ProfileGetResult = {
      payload: null,
      error: {
        message: `Profile not found for slug: ${slug} lang: ${lang}`,
      },
    };

    return result;
  }

  const result: ProfileGetResult = {
    payload: profile.value,
  };

  return result;
};
