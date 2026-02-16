import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  target: "node24",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  // Bundle everything, including workspace packages like @repo/env
  noExternal: [/@repo\/.*/],
});
