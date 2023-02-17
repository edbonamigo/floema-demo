import path from 'path'
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
