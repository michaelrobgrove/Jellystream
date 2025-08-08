// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // The 'root' is set to the 'client' directory, so Vite knows where to find your source files.
  root: path.resolve(import.meta.dirname, "client"),
  
  plugins: [
    // The standard React plugin for Vite.
    react(),
    // The Replit-specific plugins are removed because they are not needed for
    // a production build on Cloudflare Pages.
  ],
  
  resolve: {
    // These aliases are preserved to maintain your project's import paths.
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  
  build: {
    // Crucially, we set the output directory to 'dist' at the project root.
    // The path.resolve here ensures the 'dist' folder is created in the same
    // directory as your vite.config.ts file, which is the project's root.
    outDir: path.resolve(import.meta.dirname, "dist"),
    
    // This ensures the 'dist' folder is cleared before a new build.
    emptyOutDir: true,
  },
  
  // The 'server' block is removed because it's only for local development
  // and is not relevant for a production build on Cloudflare Pages.
});
