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
      js: '[name].js',
      css: '[name].css',
    },
    // Remove hash dos arquivos para biblioteca
    filenameHash: false,
    // Remove geração de HTML para biblioteca

  },

  tools: {
    rspack: (config) => {
      // Configuração para biblioteca
      config.output = {
        ...config.output,
        library: {
          type: 'module',
        },
        chunkFormat: 'module',
      };

      // Externals - não incluir React no bundle
      config.externals = {
        'react': 'react',
        'react-dom': 'react-dom',
        'react/jsx-runtime': 'react/jsx-runtime',
      };

      // Habilitar ES modules
      config.experiments = {
        outputModule: true,
      };

      // Otimização para biblioteca
      config.optimization = {
        ...config.optimization,
        splitChunks: false,
        sideEffects: false,
        minimize: false, // Deixar a minificação para quem usar a lib
      };

      return config;
    },
  },

  mode: 'production',
});