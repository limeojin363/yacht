import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  platform: "node",
  target: "node22",

  bundle: true,

  // ✅ workspace 패키지는 인라인
  noExternal: [/^@yacht\//],

  // 🔥 Node 런타임 의존 라이브러리는 external
  external: [
    "dotenv",
    "fs",
    "path",
    "crypto",
    "@prisma/client",
    "mysql2"
  ],

  sourcemap: true,
  clean: true,
  outDir: "dist"
});
