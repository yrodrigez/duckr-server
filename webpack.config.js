const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = ({
  entry: path.join(__dirname, "webapp", "index.js"),
  watch: process.env.NODE_ENV === 'development',
  node: {
	// Need this when working with express, otherwise the build fails
	__dirname: false,   // if you don't put this is, __dirname
	__filename: false,  // and __filename return blank or /
  },
  module: {
	rules: [
	  {
		test: /\.(js|jsx)$/,
		exclude: /node_modules/,
		use: {
		  loader: "babel-loader"
		}
	  }
	]
  },
  resolve: {
	extensions: ['*', '.js', '.jsx']
  },
  output: {
	path: path.join(__dirname, "public"),
	filename: "[name].js",
	publicPath: "/"
  },
  plugins: [
	new webpack.HotModuleReplacementPlugin(),
	new HtmlWebpackPlugin({
							title: 'dev',
							template: 'webapp/index.html',
						  })
  ],
  devServer: {
	hot: true,
	historyApiFallback: true
  }
});