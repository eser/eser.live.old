import { loadEnv } from "@hex/lib/options/env.ts";
import { Connection } from "@api/data/connection.ts";
// deno-lint-ignore no-unused-vars
import { seed } from "@api/data/seed.ts";
// deno-lint-ignore no-unused-vars
import { profileGet } from "@api/functions/profile-get/mod.ts";

const init = async () => {
  const env = await loadEnv();
  const kv = await Connection.instance.getKv();

  return {
    env,
    kv,
  };
};

// deno-lint-ignore no-unused-vars
const { env, kv } = await init();
