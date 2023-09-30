const { build } = require('esbuild')
const { dtsPlugin } = require('esbuild-plugin-d.ts')

build({
  platform: 'node',
  entryPoints: ['src/index.ts'],
  bundle: true,
  //plugins: [dtsPlugin()],
  external: Object.keys(require('./package.json').dependencies),
  target: 'esnext',
  outfile: 'dist/index.mjs',
  format: 'esm'
})
