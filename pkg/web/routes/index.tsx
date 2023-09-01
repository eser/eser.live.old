import { useSignal } from "@preact/signals-react";
import { Head } from "$cool/lime/runtime.ts";
import Counter from "./(_islands)/Counter.tsx";
import ValueFromContext from "./(_islands)/ValueFromContext.tsx";
import { mdxCompile } from "../mdx.ts";

export default async function Home() {
  const count = useSignal(3);

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
        Try updating this message in the
        <code className="mx-2">./routes/index.tsx</code> file, and refresh.
      </p>

      <Counter count={count} />
      <ValueFromContext />

      {JSON.stringify(frontmatter, null, 2)}
      <Component />
    </>
  );
}
