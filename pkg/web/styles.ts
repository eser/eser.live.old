#!/usr/bin/env -S deno run --allow-all

import * as path from "$std/path/mod.ts";
import { expandGlob } from "$std/fs/mod.ts";

import "@web/process-fix.ts";
import postcss from "postcss";
import postcssConfig from "./postcss.config.ts";

export async function buildStyle(
  basepath: string,
  fullpath: string,
  outputPath: string,
) {
  const relativePath = path.relative(basepath, fullpath);

  console.log(`Updating styles for ${relativePath}`);

  const css = await Deno.readTextFile(fullpath);

  const { css: outputCss } = await postcss(postcssConfig.plugins).process(css, {
    from: relativePath,
  });

  const outputFile = `${outputPath}${relativePath}`;
  await Deno.writeTextFile(outputFile, outputCss);
}

export async function buildStyles() {
  const __dirname = new URL(".", import.meta.url).pathname;

  const oldCwd = Deno.cwd();
  Deno.chdir(__dirname);

  const STYLES_INPUT_GLOB = `${__dirname}/assets/**/*.css`;
  const STYLES_OUTPUT_DIRECTORY = `${__dirname}static/`;

  for await (const entry of expandGlob(STYLES_INPUT_GLOB)) {
    await buildStyle(__dirname, entry.path, STYLES_OUTPUT_DIRECTORY);
  }

  Deno.chdir(oldCwd);
}

if (import.meta.main) {
  buildStyles();
}
