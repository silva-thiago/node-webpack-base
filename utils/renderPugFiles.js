const { resolve } = require('path');
const { readdirSync } = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const pugFiles = readdirSync(resolve(__dirname, '..', 'src', 'views'));

module.exports = pugFiles.map(pugFile => {
	const pugFileHTML = `${pugFile.split('.pug')[0]}.html`;

	return new HtmlWebpackPlugin({
		inject: false,
		filename: pugFileHTML,
		template: resolve(__dirname, '..', 'src', 'views', pugFile),
	});
});
