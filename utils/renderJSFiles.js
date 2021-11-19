const { resolve } = require('path');
const { readFileSync, writeFileSync } = require('fs');

const jsFiles = readFileSync(
	resolve(__dirname, '..', 'src', 'assets', 'js', 'index.js')
)
	.toString()
	.split('\n')
	.filter(line => line.startsWith('import'))
	.map(line =>
		line.slice(line.indexOf('./') + 2, line.lastIndexOf("'")).concat('.js')
	);

jsFiles.forEach(jsFile => {
	const file = readFileSync(
		resolve(__dirname, '..', 'src', 'assets', 'js', jsFile),
		{
			encoding: 'utf-8',
		}
	);

	const comment = `/* ************************* ${jsFile} ************************* */`;

	if (!file.includes(comment)) {
		const fileWithComments = file.concat(`\n${comment}\n`);

		writeFileSync(
			resolve(__dirname, '..', 'src', 'assets', 'js', jsFile),
			fileWithComments
		);
	}
});

module.exports = jsFiles.map(jsFile => `./src/assets/js/${jsFile}`);
