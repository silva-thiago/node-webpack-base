const devMode =
	process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test';

const path = require('path');

const { exec } = require('child_process');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackConcatPlugin = require('webpack-concat-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const portUsed = require('port-used');
const notifier = require('node-notifier');

const PugWebpackPlugin = require('./utils/renderPugFiles');
const JSWebpackPlugin = require('./utils/renderJSFiles');

const STARTING_PORT = 9000;

const webpackConfig = {
	mode: devMode ? 'development' : 'production',
	entry: {
		base: path.join(__dirname, 'src', 'index.js'),
		dark: path.join(
			__dirname,
			'src',
			'assets',
			'scss',
			'theme',
			'dark',
			'dark.scss'
		),
	},
	output: {
		filename: 'src/assets/js/-[hash].js',
		path: path.resolve(__dirname, 'dist'),
	},
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		writeTodisk: true,
		before(app) {
			app.get('/:html', (req, res) => {
				const file = req.params.html;

				res.sendFile(path.resolve(__dirname, 'dist', `${file}.html`));
			});
		},
	},
	module: {
		rules: [
			{
				test: /\.s?[ac]ss$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: { sourceMap: true },
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: true },
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								config: path.resolve(__dirname, './postcss.config.js'),
							},
							execute: true,
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.pug$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'pug-loader',
						query: { pretty: false },
					},
				],
			},
			{
				test: /\.(png|svg|jpe?g|gif)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'src/assets/img/',
							publicPath: 'src/assets/img/',
						},
					},
				],
			},
		],
	},
	optimization: {
		minimizer: [new OptimizeCssAssetsPlugin({})],
		splitChunks: {
			cacheGroups: {
				'base-styles': {
					name: 'base',
					test: module => module.constructor.name === 'CssModule',
					chunks: chunk => chunk.name.startsWith('base'),
					enforce: true,
				},
				'dark-styles': {
					name: 'dark',
					test: module => module.constructor.name === 'CssModule',
					chunks: chunk => chunk.name.startsWith('dark'),
					enforce: true,
				},
			},
		},
	},
	plugins: [
		new CleanWebpackPlugin(),
		...PugWebpackPlugin,
		new MiniCssExtractPlugin({
			filename: 'src/assets/css/[name].css',
		}),
		new WebpackConcatPlugin({
			uglify: true,
			sourceMap: true,
			outputPath: 'src/assets/js/',
			fileName: 'scripts.js',
			filesToConcat: JSWebpackPlugin,
		}),
		new FriendlyErrorsWebpackPlugin(),
		{
			apply(compiler) {
				compiler.hooks.afterEmit.tap('DeleteWebpackJSPlugin', () => {
					exec('rm dist/src/assets/js/-*.js', (err, stdout, stderr) => {
						if (stdout) process.stdout.write(stdout);
						if (stderr) process.stderr.write(stderr);
					});
				});
			},
		},
		{
			apply(compiler) {
				compiler.hooks.done.tap('CompilationToast', stats => {
					if (process.env.NODE_ENV === 'development') {
						if (stats.compilation.errors.length > 0) {
							notifier.notify({
								title: 'Erro',
								message: 'Houve algum erro na compilação!',
								icon: path.join(
									__dirname,
									'utils',
									'node-notifier-icons',
									'error.png'
								),
							});
						} else {
							notifier.notify({
								title: 'Sucesso',
								message: 'Aplicação compilada!',
								icon: path.join(
									__dirname,
									'utils',
									'node-notifier-icons',
									'success.png'
								),
							});
						}
					}
				});
			},
		},
	],
};

const handlePortChange = async (resolve, reject, port) => {
	const status = await portUsed.check(port, '127.0.0.1');

	if (status) {
		const newPort = port + 1;
		await handlePortChange(resolve, reject, newPort);
	} else {
		resolve(port);
	}
};

module.exports = new Promise(async (resolve, reject) => {
	try {
		const port = await new Promise(async (res, rej) => {
			await handlePortChange(res, rej, STARTING_PORT);
		});

		webpackConfig.devServer.port = port;
		resolve(webpackConfig);
	} catch (err) {
		reject(err);
	}
});
