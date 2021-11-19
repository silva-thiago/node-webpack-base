const { resolve } = require('path');
const { readFileSync } = require('fs');

const devMode = process.env.NODE_ENV === 'development';
const prodMode = process.env.NODE_ENV === 'production';
const testMode = process.env.NODE_ENV === 'test';

let jsonFile;

if (devMode) {
	jsonFile = resolve(__dirname, '..', 'development.env.config.json');
}

if (prodMode) {
	jsonFile = resolve(__dirname, '..', 'production.env.config.json');
}

if (testMode) {
	jsonFile = resolve(__dirname, '..', 'test.env.config.json');
}

const envConstants = JSON.parse(readFileSync(jsonFile));

const BASE_URL = envConstants.base_url;
const DIST_URL = envConstants.dist_url;
const RESOURCE_URL = envConstants.resource_url;

const globalConstants = {
	BASE_URL,
	DIST_URL,
	RESOURCE_URL,
	VERSAO: 'x.y.z',
	SITE_TITLE: 'Node Webpack Base',
	SITE_DESC: 'Projeto base feito em Node & Webpack',
	SITE_AUTOR: 'Thiago Silva',
	ANALYTICS_ID: '',
	IMG_DIR: `${RESOURCE_URL}img/`,
	CSS_DIR: `${RESOURCE_URL}css/`,
	JS_DIR: `${RESOURCE_URL}js/`,
	VENDORS_DIR: `${RESOURCE_URL}vendors/`,
	JSON_DIR: `${RESOURCE_URL}json/`,
};

module.exports = globalConstants;
