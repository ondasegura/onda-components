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
        // 👇 ESSA LINHA É CRUCIAL
        // Força o nome do arquivo de saída para ser exatamente 'index.js',
        // sem hashes ou subpastas como 'static/js'.
        filename: {
            js: "index.js",
        },
    },
    // 👇 ESSA É A PARTE MAIS IMPORTANTE DA CORREÇÃO
    // Desativa a geração do arquivo HTML. Isso diz ao Rsbuild:
    // "Não estou criando um aplicativo, apenas um pacote de JavaScript".
    tools: {
        htmlPlugin: false,
    },
});
