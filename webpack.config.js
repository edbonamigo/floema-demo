const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

const IS_DEVELOPMENT = process.env.NOVE_ENV === 'dev'

const dirApp = path.join(__dirname, 'app')
const dirShared = path.join(__dirname, 'shared')
const dirStyles = path.join(__dirname, 'styles')
const disNode = 'node_modules'

module.exports = {
	entry: [path.join(dirApp, 'index.js'), path.join(dirStyles, 'index.scss')],
	resolve: {
		modules: [dirApp, dirShared, dirStyles, disNode],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public'),
	},
	plugins: [
		new webpack.DefinePlugin({
			IS_DEVELOPMENT,
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: './shared',
					to: '',
				},
			],
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new CleanWebpackPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							url: false,
						},
					},
					{
						loader: 'postcss-loader',
					},
					{
						loader: 'sass-loader',
						options: {
							implementation: require('sass'),
						},
					},
				],
			},
			{
				test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
				loader: 'file-loader',
				options: {
					name(file) {
						return '[hash].[ext]'
					},
				},
			},
			// You need this, if you are using `import file from "file.ext"`, for `new URL(...)` syntax you don't need it
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				type: 'asset',
			},
			{
				test: /\.(glsl|frag|vert)$/,
				loader: 'raw-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(glsl|frag|vert)$/,
				loader: 'glslify-loader',
				exclude: /node_modules/,
			},
		],
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin(),
			// We recommend using only for the "production" mode
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminMinify,
					options: {
						plugins: [
							'imagemin-gifsicle',
							'imagemin-mozjpeg',
							'imagemin-pngquant',
							'imagemin-svgo',
						],
					},
				},
			}),
		],
	},
}
