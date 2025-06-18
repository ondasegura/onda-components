// rsbuild.config.ts

import {defineConfig} from "@rsbuild/core";
import {pluginReact} from "@rsbuild/plugin-react";

export default defineConfig({
    plugins: [pluginReact()],
    source: {
        entry: {
            index: "./src/index.ts",
        },
    },
    output: {
        distPath: {root: "./dist"},
        cleanDistPath: true,
        filename: {
            js: "index.js",
        },
    },
    tools: {
        htmlPlugin: false,
    },
});
