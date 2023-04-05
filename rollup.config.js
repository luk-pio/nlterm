import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import shebang from 'rollup-plugin-preserve-shebang';

export default {
  input: "src/nlterm.ts",
  output: [
    {
      file: "dist/nlterm.cjs",
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    json(),
    resolve(),
    commonjs(),
    shebang({
      shebang: "#!/usr/bin/env node",
    }),
  ],
};
