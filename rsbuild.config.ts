import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [
    pluginReact()
  ],
  // ... resto da configuração permanece igual
});