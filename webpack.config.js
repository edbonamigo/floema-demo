const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(__dirname, 'app')
const dirAssets = path.join(__dirname, 'assets')
const dirStyles = path.join(__dirname, 'styles')
const dirNode = 'node_modules'

module.exports = {
	context: __dirname,
	entry: [
		path.resolve(__dirname, './app.js'),
		path.join(dirStyles, 'index.scss')
	],
	output: {
		path: path.resolve(__dirname, 'public')
	},

	target: 'node',

	resolve: {
		modules: [dirNode, dirApp, dirAssets, dirStyles]
	},

	plugins: [
		new webpack.DefinePlugin({
			IS_DEVELOPMENT
		}),

		new webpack.ProvidePlugin({}),

		new CopyWebpackPlugin({
			patterns: [
				{
					from: './assets',
					to: ''
				}
			]
		}),

		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css'
		})
	],

	module: {
		rules: [
			{
				test: /\.pug$/,
				exclude: /node_modules/,
				use: ['pug-loader']
			},

			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},

			{
				test: /\.(sa|sc|c)ss$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: ''
						}
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: false
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: false
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: false
						}
					}
				]
			},

			{
				test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
				exclude: /node_modules/,
				loader: 'file-loader',
				options: {
					name(file) {
						return '[contenthash].[ext]'
					}
				}
			},

			{
				test: /\.(glsl|frag|vert)$/,
				loader: 'raw-loader',
				exclude: /node_modules/
			},

			{
				test: /\.(glsl|frag|vert)$/,
				exclude: /node_modules/,
				loader: 'glslify-loader'
			}
		]
	}
}
