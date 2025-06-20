import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],

  source: {
    entry: {
      index: './src/index.ts',
    },
  },

  output: {
    distPath: {
      root: 'dist',
    },
    target: 'web',
    filename: {
      js: 'index.js',
      css: 'index.css',
    },
    filenameHash: false,
    emitHtml: false,
  },

  tools: {
    rspack: (config) => {
      // Configuração para biblioteca ES Module
      config.output = {
        ...config.output,
        library: {
          type: 'module',
        },
      };

      // Externals - não incluir React no bundle
      config.externals = {
        'react': 'react',
        'react-dom': 'react-dom',
        'react/jsx-runtime': 'react/jsx-runtime',
      };

      // Habilitar ES modules
      config.experiments = {
        ...config.experiments,
        outputModule: true,
      };

      // Otimização para biblioteca
      config.optimization = {
        ...config.optimization,
        splitChunks: false,
        sideEffects: false,
        minimize: true, // Minificar para produção
      };

      return config;
    },
  },

  mode: 'production',
});