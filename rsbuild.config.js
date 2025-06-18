import {defineConfig} from "@rsbuild/core";
import {pluginReact} from "@rsbuild/plugin-react";
import tailwindcssPlugin from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
    plugins: [pluginReact()],
    source: {
        entry: {
            index: "./src/index.ts",
        },
    },
    output: {
        distPath: {
            root: "./dist",
            js: "",
        },
        cleanDistPath: true,
        // filename: {
        //     js: "index.js",
        // },
        filenameHash: false,
    },
    tools: {
        htmlPlugin: false,
        rspack(config) {
            config.output.library = {
                type: "module",
            };
            config.experiments = {
                ...config.experiments,
                outputModule: true,
            };
        },
        postcss: (config) => {
            config.postcssOptions.plugins = [tailwindcssPlugin(), autoprefixer()];
        },
    },
});
