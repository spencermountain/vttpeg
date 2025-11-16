import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import sizeCheck from 'rollup-plugin-filesize-check'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json').toString())
const version = pkg.version
console.log('\n 📦  - running rollup..\n')

const banner = '/* spencermountain/vttpeg ' + version + ' MIT */'

export default [
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: 'builds/vttpeg.mjs', format: 'esm' }],
    plugins: [resolve(), json(), terser(), sizeCheck({ expect: 48, warn: 10 })]
  },
  {
    input: 'src/index.js',
    output: [
      {
        banner: banner,
        file: 'builds/vttpeg.cjs',
        format: 'umd',
        sourcemap: false,
        name: 'vttpeg'
      }
    ],
    plugins: [
      resolve(),
      json(),
      commonjs(),
      sizeCheck({ expect: 110, warn: 10 })
    ]
  },
  {
    input: 'src/index.js',
    output: [{ banner: banner, file: 'builds/vttpeg.min.js', format: 'umd', name: 'vttpeg' }],
    plugins: [
      resolve(),
      json(),
      commonjs(),
      terser(),
      sizeCheck({ expect: 48, warn: 10 })
    ]
  }
]
