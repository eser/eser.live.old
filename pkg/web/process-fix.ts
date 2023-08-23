// deno-lint-ignore prefer-namespace-keyword
declare module globalThis {
  let process: unknown;
}

if (globalThis.process === undefined) {
  globalThis.process = {
    env: {},
    argv: [],
    versions: {
      node: "10.0.0",
    },
    cwd: () => Deno.cwd(),
  };
}
