import * as React from "preact/compat";
import { useLayoutEffect } from "../use-layout-effect/mod.ts";

// We `toString()` to prevent bundlers from trying to `import { useId } from 'react';`
const useReactId = (React as any)["useId".toString()] || (() => undefined);
let count = 0;

function useId(deterministicId?: string): string {
  const [id, setId] = React.useState<string | undefined>(useReactId());
  // React versions older than 18 will have client-side ids only.
  useLayoutEffect(() => {
    if (!deterministicId) setId((reactId) => reactId ?? String(count++));
  }, [deterministicId]);
  return deterministicId || (id ? `radix-${id}` : "");
}

export { useId };
