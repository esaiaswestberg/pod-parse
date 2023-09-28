const { build } = require('esbuild')
const { Generator } = require('npm-dts')

const shared = {
  entryPoints: ['src/index.ts'],
  bundle: true
}

// Build commonjs
build({
  ...shared,
  outfile: 'dist/index.js',
  format: 'cjs'
})

// Build esm
build({
  ...shared,
  outfile: 'dist/index.esm.js',
  format: 'esm'
})

// Generate types
new Generator({
  entry: 'src/index.ts',
  output: 'dist/index.d.ts'
}).generate()
