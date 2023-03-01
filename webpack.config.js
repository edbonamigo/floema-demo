import path from 'path'
// Hack to enable __dirname on ES6 modules
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

import webpack from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import dotenv from 'dotenv'
dotenv.config()

const IS_DEVELOPMENT = process.env.NOVE_ENV === 'dev'

const dirApp = path.join(__dirname, 'app')
const dirShared = path.join(__dirname, 'shared')
const dirStyles = path.join(__dirname, 'styles')
const disNode = 'node_modules'

		modules: [dirApp, dirShared, dirStyles, disNode],
					from: './shared',
}

export default config
