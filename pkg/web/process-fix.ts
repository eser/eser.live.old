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
