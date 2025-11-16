import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
const name = 'vttpeg'

import pkg from './package.json' with { type: 'json' };

const banner = `/* ${name} ${pkg.version} MIT */`

export default [
  {
    input: 'src/_client.js',
    output: [
      {
        file: `builds/${name}.mjs`,
        format: 'esm',
        banner: banner,
      },
    ],
    plugins: [
      resolve(),
      json(),
      commonjs(),
      terser(),
    ],
  },
  {
    input: 'src/_client.js',
    output: [
      {
        file: `builds/${name}.min.js`,
        format: 'umd',
        name,
        banner: banner,
      },
    ],
    plugins: [
      resolve(),
      json(),
      commonjs(),
      terser(),
    ],
  },
]
