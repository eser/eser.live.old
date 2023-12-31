import { loadEnv } from "$cool/hex/options/env.ts";
import { Connection } from "$api/data/connection.ts";
import * as mod from "$api/mod.ts";

// TODO(@eser) get dependency injection container entries instead of this
const init = async () => {
  const env = await loadEnv();
  const kv = await Connection.instance.getKv();

  return {
    ...mod,
    env,
    kv,
  };
};

const vars = await init();
const varKeys = Object.keys(vars);

for (const key of varKeys) {
  // @ts-ignore globalThis type check
  globalThis[key] = vars[key];
}

console.log("\npredefined variables\n--------------------");
console.log(varKeys.map((x) => x.padEnd(20, " ")).join("| "));
console.log();
