import path from 'path'
// Hack to enable __dirname on ES6 modules
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

import { merge } from 'webpack-merge'
import config from './webpack.config.js'

const configBuild = merge(config, {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'public'),
  },
})

export default configBuild
