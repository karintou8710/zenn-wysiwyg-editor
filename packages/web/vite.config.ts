/// <reference types="vite" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // TODO: zenn-wysiwyg-editorに含める
      babel: {
        plugins: [
          [
            "prismjs",
            {
              languages: "all",
              plugins: ["diff-highlight"],
            },
          ],
        ],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
