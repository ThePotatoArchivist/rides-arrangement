import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

export default defineConfig({
    input: "./src/index.ts",
    output: {
        dir: "dist",
        format: "cjs",
    },
    plugins: [
        typescript(),
    ],
    treeshake: false
});