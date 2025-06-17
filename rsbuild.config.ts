import {defineConfig} from "@rsbuild/core";
import path from "node:path";

export default defineConfig({
    build: {
        outDir: "dist",
        target: "es2022",
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                format: "esm",
                preserveModules: true,
                dir: "dist",
                entryFileNames: "[name].mjs",
            },
        },
    },
    source: {
        alias: {
            "@components": path.resolve(__dirname, "src/components"),
        },
    },
});
