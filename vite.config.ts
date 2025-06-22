import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // 👈 dossier de sortie
    lib: {
      entry: 'src/content.ts', // ton fichier source
      formats: ['iife'],       // 👈 IIFE = format compatible content script
      name: 'ContentScript'    // 👈 nom global (obligatoire avec IIFE)
    },
    rollupOptions: {
      output: {
        entryFileNames: 'content.js' // 👈 nom du fichier de sortie
      }
    },
    target: 'es2020',
    emptyOutDir: true
  }
});
