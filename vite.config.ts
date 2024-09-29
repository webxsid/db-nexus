import react from "@vitejs/plugin-react";
import { rmSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron/simple";
import json5 from "vite-plugin-json5";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourceMap = isServe ? "inline" : false;

  if (isBuild) {
    rmSync("app", { recursive: true, force: true });
  }

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@main": path.resolve(__dirname, "main"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "shared/assets"),
      },
    },
    optimizeDeps: {
      exclude: ["mongodb"],
    },
    plugins: [
      react(),
      json5(),
      tsconfigPaths(),
      electron({
        main: {
          entry: "main/index.ts",
          onstart(args) {
            console.log(
              "tsconfig paths:",
              require("./tsconfig.json").compilerOptions.paths,
            );
            console.log("Electron started with args:", args);
            args.startup();
          },
          vite: {
            plugins: [tsconfigPaths(), json5()],
            define: {
              "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            },
            build: {
              sourcemap: sourceMap,
              minify: isBuild,
              outDir: "app",
              emptyOutDir: true,
              rollupOptions: {
                external: [
                  ...Object.keys("dependencies" in pkg ? pkg.dependencies : {}),
                ],
              },
            },
          },
        },
        // preload: path.resolve(__dirname, "src/pre-loaders/index.ts"),
      }),
      nodePolyfills(),
    ],
    server: {
      port: +pkg.debug.env.VITE_PORT,
    },
    clearScreen: false,
  };
});
