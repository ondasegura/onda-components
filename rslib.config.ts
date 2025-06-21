import { defineConfig } from '@rslib/core';



export default defineConfig({
    lib: [
        {
            format: 'esm',
            output: {
                distPath: {
                    root: './dist',
                },
            },
            dts: true,
        },
        {
            format: 'cjs',
            output: {
                distPath: {
                    root: './dist',
                },
            },
        },
    ],
    source: {
        entry: {
            index: './src/index.ts',
        },
    },
    output: {
        externals: {
            react: 'react',
            'react-dom': 'react-dom',
        },
    },
    tools: {
        postcss: {
            postcssOptions: {
                plugins: [
                    require('tailwindcss'),
                    require('autoprefixer'),
                ],
            },
        },
    },
});