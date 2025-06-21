import { defineConfig } from '@rslib/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  lib: [
    {
      format: 'esm',            // ou ['esm', 'cjs'] se quiser múltiplos
      bundle: false,            // modo "exportar/transpilar"
      source: {
        entry: {
          paginaTeste: './src/components/PaginaTeste/index.tsx',  // define o entry

        }

      },
      dts: true,                // gera types
    },
  ],
  output: {
    target: 'web',
  },
  plugins: [pluginReact()],
})
