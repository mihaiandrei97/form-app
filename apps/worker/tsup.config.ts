import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  target: "node24",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  // Bundle workspace packages but keep native CJS modules external
  noExternal: [/@repo\/.*/],
  external: ["dotenv"],
});
