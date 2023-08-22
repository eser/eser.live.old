import { z } from "@zod";
import { type LanguageCode } from "@protocol/languages.ts";
import { type Profile, type ProfileEntity } from "@protocol/profile.ts";
import { type ResultType } from "@protocol/result-type.ts";
import { Connection } from "@api/data/connection.ts";

export const profileGet = async (
  slug: string,
  lang: LanguageCode,
) => {
  const kv = await Connection.instance.getKv();

  const slugValidated = await z.string().parseAsync(slug);

  const kvRecord = await kv.get<ProfileEntity>(["profile", slugValidated]);

  if (kvRecord.value === null) {
    const result: ResultType<Profile> = {
      payload: null,
      error: {
        message: `Profile not found for slug: ${slug} lang: ${lang}`,
      },
    };

    return result;
  }

  const profile: Profile = {
    ...kvRecord.value,

    title: kvRecord.value.tx[lang]?.title ?? "",
    description: kvRecord.value.tx[lang]?.description ?? "",

    links: undefined,
    pages: undefined,
  };

  const result: ResultType<Profile> = {
    payload: profile,
  };

  return result;
};
