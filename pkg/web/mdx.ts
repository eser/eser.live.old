import * as jsxRuntime from "preact/jsx-runtime";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { compile, type CompileOptions } from "@mdx-js/mdx";

function getCompileOptions(): CompileOptions {
  return {
    jsx: false,
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    outputFormat: "function-body",
    providerImportSource: undefined,
  };
}

export async function mdxCompile(
  source: string,
  scope: Record<string, unknown> = {},
) {
  const serialized = await compile(source, getCompileOptions());

  const fullScope = Object.assign(
    {
      opts: jsxRuntime,
      // frontmatter: serialized.frontmatter,
    },
    scope,
  );

  const keys = Object.keys(fullScope);
  const values = Object.values(fullScope);

  const hydrateFn = Reflect.construct(
    Function,
    keys.concat(`${serialized.value}`),
  );

  const evaluation = hydrateFn.apply(hydrateFn, values);

  return {
    Component: evaluation.default,
    frontmatter: evaluation.frontmatter ?? {},
  };
}
