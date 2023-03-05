import { babel } from '@rollup/plugin-babel'

const config = {
  input: 'src/hashjump.js',
  output: {
    dir: 'dist',
    format: 'umd',
    name: 'hashjump',
    sourcemap: true
  },
  plugins: [
    babel({ babelHelpers: 'bundled' })
  ]
}

export default config
