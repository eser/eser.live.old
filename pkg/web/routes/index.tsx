import { Head } from "$fresh/runtime.ts";
import Counter from "./(_islands)/Counter.tsx";
import { mdxCompile } from "../mdx.ts";

export default async function Home() {
  // const count = useSignal(3);
  // const count = 3;

  const { Component, frontmatter } = await mdxCompile(`---
hello: frontmatter
---

Rest of **document**`);

  return (
    <>
      <Head>
        <title>coollime-project</title>
      </Head>
      <p>
        Try updating this message in the
        <code className="mx-2">./routes/index.tsx</code> file, and refresh.
      </p>
      <Counter />

      {JSON.stringify(frontmatter, null, 2)}
      <Component />
    </>
  );
}
