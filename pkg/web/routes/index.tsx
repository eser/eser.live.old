import * as ReactHooks from "preact/hooks";
import { Head } from "$cool/lime/runtime.ts";
import Counter from "./(_islands)/Counter.tsx";
import { mdxCompile } from "../mdx.ts";

import { TestContext } from "../islands/_testContext.ts";

export default async function Home() {
  // const count = useSignal(3);
  // const count = 3;

  // const value = ReactHooks.useContext(TestContext);
  const value = "ede";

  const { Component, frontmatter } = await mdxCompile(`---
hello: frontmatter
---

Rest of **document**`);

  return (
    <>
      <Head>
        <title>lime-project</title>
      </Head>
      <p>
        Try updating this message in the {value}
        <code className="mx-2">./routes/index.tsx</code> file, and refresh.
      </p>
      <Counter />

      {JSON.stringify(frontmatter, null, 2)}
      <Component />
    </>
  );
}
