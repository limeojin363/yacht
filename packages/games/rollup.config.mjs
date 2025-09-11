import typescript from "@rollup/plugin-typescript";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import {
  readFileSync
} from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));

export default [
  // Main bundle
  {
    input: "src/index.ts",
    output: [{
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
        
      },
      {
        file: "dist/index.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/index.d.cts",
        format: "cjs",
      },
      {
        file: "dist/index.d.ts",
        format: "es",
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "./dist",
        outDir: "./dist",
        rootDir: "./src",
      }),
    ],
  },
  // Sub-module bundle: default
  {
    input: "src/default/index.ts",
    output: [{
        file: "dist/default/index.cjs",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/default/index.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/default/index.d.cts",
        format: "cjs",
      },
      {
        file: "dist/default/index.d.ts",
        format: "es",
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "./dist/default",
        outDir: "./dist/default",
        rootDir: "./src/default",
      }),
    ],
  },
  // Sub-module bundle: lucky
  {
    input: "src/lucky/index.ts",
    output: [{
        file: "dist/lucky/index.cjs",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/lucky/index.js",
        format: "es",
        sourcemap: true,
      },
      {
        file: "dist/lucky/index.d.cts",
        format: "cjs",
      },
      {
        file: "dist/lucky/index.d.ts",
        format: "es",
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "./dist/lucky",
        outDir: "./dist/lucky",
        rootDir: "./src/lucky",
      }),
    ],
  },
];