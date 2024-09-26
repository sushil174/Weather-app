const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
	mode: 'development',
	entry: './src/index.js',
	devtool: 'inline-source-map',
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Output Management',
            template: path.resolve(__dirname, './src/index.html'),
		}),

		new CopyWebpackPlugin({
			patterns: [
				{from: 'src/svg' ,to: 'svg'}
			],
		}),
	],

	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
        clean: true
	},

	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},

			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},

			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
			},

			{
				test: /\.(csv|tsv)$/i,
				use: ['csv-loader'],
			},

			{
				test: /\.xml$/i,
				use: ['xml-loader'],
			},

			{
				test: /\.svg$/i,
				use: [
					{
						loader: 'file-loader',
					}
				]
			}
		],
	},
};