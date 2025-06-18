// rsbuild.config.js - O CÓDIGO CORRETO
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
        distPath: {
            root: "./dist",
        },
        cleanDistPath: true,
        library: {
            type: "module",
        },
        filename: {
            js: "index.js",
            css: "index.css",
        },
        filenameHash: false,
    },
    tools: {
        htmlPlugin: false,
        // A configuração do PostCSS foi movida para o próprio arquivo para maior clareza
    },
    externals: {
        react: "react",
        "react-dom": "react-dom",
        zustand: "zustand",
        "zustand/middleware/immer": "zustand/middleware/immer",
        "onda-types": "onda-types",
        "onda-utils": "onda-utils",
    },
});
