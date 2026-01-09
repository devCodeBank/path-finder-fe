import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    svgr({
      svgrOptions: { icon: true },
    }),
  ],
  resolve: {
    alias: {
      "@mui/styled-engine": "@mui/styled-engine-sc",
      "@": "/src",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@api": "/src/api",
      "@hooks": "/src/hooks",
      "@redux": "/src/redux",
      "@theme": "/src/theme",
      "@utils": "/src/utils",
      "@assets": "/src/assets",
      "@services": "/src/services",
      "@config": "/src/config",
      "react-is": "react-is",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and related libraries
          vendor: ["react", "react-dom", "react-router-dom"],
          // Material-UI chunk
          mui: ["@mui/material", "@mui/icons-material", "@mui/styled-engine-sc"],
          // Redux chunk
          redux: ["@reduxjs/toolkit", "react-redux"],
          // Styled components chunk
          styled: ["styled-components"],
          // AWS Amplify chunk
          amplify: ["aws-amplify"],
        },
      },
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    minify: "terser",
  },
});
