import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    distPath: { root: './dist' },
    cleanDistPath: true,
    filename: {
      js: '[name].[hash:8].js'
    },
    assetPrefix: './',
  },
});
