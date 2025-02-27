import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import preserveDirectives from 'rollup-preserve-directives';
import fg from 'fast-glob';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Generate individual entries for each UI component
const uiComponents = fg.sync('lib/components/ui/**/*.tsx').reduce((entries, file) => {
  const relativePath = path.relative('lib', file);
  const entryName = relativePath.replace(/\.[tj]sx$/, ''); // Remove file extension
  entries[entryName] = fileURLToPath(new URL(file, import.meta.url));
  return entries;
}, {} as Record<string, string>);

// Add main entry for the rest of the library
const entries = {
  ...uiComponents,
  'bluevoid-ui': resolve(__dirname, 'lib/main.tsx'),
  'utils': resolve(__dirname, 'lib/utils.ts'),
  'hooks': resolve(__dirname, 'lib/hooks.ts'),
};

console.log('Entries:', entries);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    dts({ rollupTypes: true, tsconfigPath: './tsconfig.app.json' }),
  ],
  build: {
    minify: false,
    lib: {
      entry: entries,
      name: '@bluevoid/ui',
      formats: ['es'],
      fileName: (_format, entryName) => {
        if (entryName.startsWith('components/ui/')) {
          return `${entryName}.js`; // Preserve UI components separately
        }
        if (entryName === 'utils' || entryName === 'hooks') {
          return `${entryName}.js`; // Preserve utils separately
        }
        return 'bluevoid-ui.js'; // Bundle everything else
      },
    },
    rollupOptions: {
      external: [
        '@hookform/resolvers',
        '@mantine/hooks',
        '@tabler/icons-react',
        'date-fns',
        'embla-carousel-react',
        'react-day-picker',
        'react-dom',
        'react-hook-form',
        'react-resizable-panels',
        'react',
        'react/jsx-runtime', 
        'recharts',
        'tinycolor2',
      ],
      output: {
        // chunkFileNames: 'chunks/[name]-[hash].js', // Avoid name collisions

        // entryFileNames(chunkInfo) {
        //   if (chunkInfo.isDynamicEntry){
        //     return 'bluevoid-ui-dyn.js';
        //   }
        //   if (chunkInfo.name.startsWith('components/ui/')) {
        //     return `${chunkInfo.name}.js`;
        //   }
        //   return 'bluevoid-ui.js';
        // },
      },
      plugins: [preserveDirectives()],
    },
  },
  resolve: {
    alias: {
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
});
