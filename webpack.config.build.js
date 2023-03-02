const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// Hack to enable __dirname on ES6 modules

const { merge } = require('webpack-merge')
const config = require('./webpack.config.js')

module.exports = merge(config, {
	mode: 'production',

	output: {
		path: path.join(__dirname, 'public'),
	},

	plugins: [new CleanWebpackPlugin()],
})
