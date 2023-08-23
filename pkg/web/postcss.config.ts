import autoprefixer from "autoprefixer";
import csso from "postcss-csso";
import customMediaPlugin from "postcss-custom-media";
import postcssPresetEnv from "postcss-preset-env";
import tailwindcss from "tailwindcss";

export default {
  plugins: [
    // @ts-ignore no call signature
    tailwindcss(),
    // @ts-ignore no call signature
    customMediaPlugin(),
    // @ts-ignore no call signature
    postcssPresetEnv({
      stage: 3,
      features: {
        "nesting-rules": true,
        "custom-media-queries": true,
        "media-query-ranges": true,
      },
    }),
    autoprefixer(),
    csso(),
  ],
};
