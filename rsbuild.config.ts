import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],

  source: {
    entry: {
      index: './dev/main.tsx',
    },
  },
  html: {
    template: './dev/index.html',
  },

});