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
    // The '..' is important because the 'root' is 'client', so we need to go
    // up one directory to put the build output in the main 'dist' folder.
    outDir: path.resolve(import.meta.dirname, "../dist"),
    
    // We also remove 'dist/public' from the output path so the files
    // are at the root of the 'dist' directory, which is what Cloudflare Pages expects.
    emptyOutDir: true,
  },
  
  // The 'server' block is removed because it's only for local development
  // and is not relevant for a production build on Cloudflare Pages.
});
