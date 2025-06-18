// rsbuild.config.ts
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
        },
        cleanDistPath: true,
        // 1. Maneira correta e de alto nível para definir a saída como uma biblioteca
        library: {
            type: "module",
        },
        // 2. Garante que os nomes dos arquivos sejam previsíveis
        // filename: {
        //     js: "index.js",
        //     css: "index.css",
        // },
        filenameHash: false,
    },
    tools: {
        // 3. O htmlPlugin: false está correto e permanece
        htmlPlugin: false,
        // A configuração do PostCSS pode ser movida para um arquivo postcss.config.js
        // ou mantida aqui, mas usando import.
        postcss: (config) => {
            config.postcssOptions.plugins = [tailwindcssPlugin(), autoprefixer()];
        },
        // A customização do rspack não é mais necessária!
    },
    // 4. A CORREÇÃO MAIS IMPORTANTE: Definindo as dependências externas
    externals: {
        react: "react",
        "react-dom": "react-dom",
        zustand: "zustand",
        "zustand/middleware/immer": "zustand/middleware/immer",
        "onda-types": "onda-types",
        "onda-utils": "onda-utils",
    },
});
