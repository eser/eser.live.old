import { useSignal } from "@preact/signals-react";
import { Head, Island } from "$cool/lime/runtime.ts";
import Counter from "./(_islands)/Counter.tsx";
import ValueFromContext from "./(_islands)/ValueFromContext.tsx";
import { mdxCompile } from "../mdx.ts";
// import { useMemo } from "react";

export default function Home() {
  const count = useSignal(3);

  // const count = useMemo(() => {
  //   return 5;
  // }, []);

//   const { Component, frontmatter } = await mdxCompile(`---
// hello: frontmatter
// ---

// Rest of **document**`);

  return (
    <>
      <Head>
        <title>lime-project</title>
      </Head>
      <p>
        Try updating this message in the
        <code className="mx-2">./routes/index.tsx</code> file, and refresh.
      </p>

      <Island>
        <Counter count={count} />
      </Island>
      <Island id="context">
        <ValueFromContext />
      </Island>

      {/* {JSON.stringify(frontmatter, null, 2)}
      <Component /> */}
    </>
  );
}
