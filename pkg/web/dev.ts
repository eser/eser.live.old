#!/usr/bin/env -S deno run --allow-all --watch=./shared/assets/,./routes/

import dev from "$fresh/dev.ts";

import { buildStyles } from "@web/styles.ts";
await buildStyles();

await dev(import.meta.url, "./main.ts");
