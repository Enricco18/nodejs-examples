const tape = require('tape');
const bent = require('bent');
const getPort = require('get-port');
const nock = require('nock');

const server = require('../');
const nodeVersion = require('./nodeVersion.json')

const getJSON = bent('json');
const getBuffer = bent('buffer');

const tests = {
	"v0": {

		"version": "v0.12.17",
		"date": "2016-10-18",
		"files": [
			"headers",
			"linux-x64",
			"linux-x86",
			"osx-x64-pkg",
			"osx-x64-tar",
			"osx-x86-tar",
			"src",
			"sunos-x64",
			"sunos-x86",
			"win-x64-exe",
			"win-x86-exe",
			"win-x86-msi"
		],
		"npm": "2.15.1",
		"v8": "3.28.71.19",
		"uv": "1.6.1",
		"zlib": "1.2.8",
		"openssl": "1.0.1u",
		"modules": "14",
		"lts": false,
		"security": true

	},
	"v4": {
		"version": "v4.9.0",
		"date": "2018-03-28",
		"files": [
			"headers",
			"linux-arm64",
			"linux-armv6l",
			"linux-armv7l",
			"linux-ppc64le",
			"linux-x64",
			"linux-x86",
			"osx-x64-pkg",
			"osx-x64-tar",
			"src",
			"sunos-x64",
			"sunos-x86",
			"win-x64-7z",
			"win-x64-exe",
			"win-x64-msi",
			"win-x64-zip",
			"win-x86-7z",
			"win-x86-exe",
			"win-x86-msi",
			"win-x86-zip"
		],
		"npm": "2.15.11",
		"v8": "4.5.103.53",
		"uv": "1.9.1",
		"zlib": "1.2.11",
		"openssl": "1.0.2o",
		"modules": "46",
		"lts": "Argon",
		"security": true
	},
	"v14": {
		"version": "v14.9.0",
		"date": "2020-08-26",
		"files": [
			"aix-ppc64",
			"headers",
			"linux-arm64",
			"linux-armv7l",
			"linux-ppc64le",
			"linux-s390x",
			"linux-x64",
			"osx-x64-pkg",
			"osx-x64-tar",
			"src",
			"win-x64-7z",
			"win-x64-exe",
			"win-x64-msi",
			"win-x64-zip",
			"win-x86-7z",
			"win-x86-exe",
			"win-x86-msi",
			"win-x86-zip"
		],
		"npm": "6.14.8",
		"v8": "8.4.371.19",
		"uv": "1.39.0",
		"zlib": "1.2.11",
		"openssl": "1.1.1g",
		"modules": "83",
		"lts": false,
		"security": false
	},
	"v13": {
		"version": "v13.14.0",
		"date": "2020-04-28",
		"files": [
			"aix-ppc64",
			"headers",
			"linux-arm64",
			"linux-armv7l",
			"linux-ppc64le",
			"linux-s390x",
			"linux-x64",
			"osx-x64-pkg",
			"osx-x64-tar",
			"src",
			"sunos-x64",
			"win-x64-7z",
			"win-x64-exe",
			"win-x64-msi",
			"win-x64-zip",
			"win-x86-7z",
			"win-x86-exe",
			"win-x86-msi",
			"win-x86-zip"
		],
		"npm": "6.14.4",
		"v8": "7.9.317.25",
		"uv": "1.37.0",
		"zlib": "1.2.11",
		"openssl": "1.1.1g",
		"modules": "79",
		"lts": false,
		"security": false
	}
}

const context = {};

tape('setup', async function (t) {
	const port = await getPort();
	context.server = server.listen(port);
	context.origin = `http://localhost:${port}`;

	t.end()
})


tape('should get dependencies', async function (t) {
	const html = (await getBuffer(`${context.origin}/dependencies`)).toString();

	t.ok(html.includes('bent'), "should contain bent");

	t.ok(html.includes('express'), "should contain express");

	t.ok(html.includes('hbs'), "should contain hbs");

	t.end();
})

tape('should get minimum secure versions', async function (t) {
	nock("https://nodejs.org").get("/dist/index.json").reply(200, nodeVersion);

	const minimumJson = (await getJSON(`${context.origin}/minimum-secure`));

	t.deepEqual(minimumJson['v0'], tests.v0, 'v0 version should match');

	t.deepEqual(minimumJson['v4'], tests.v4, 'v4 version should match');

	t.end();
})

tape('should get minimum secure versions', async function (t) {
	nock("https://nodejs.org").get("/dist/index.json").reply(200, nodeVersion);

	const latestJson = (await getJSON(`${context.origin}/latest-releases`));

	t.deepEqual(latestJson['v14'], tests.v14, 'v14 version should match');

	t.deepEqual(latestJson['v13'], tests.v13, 'v13 version should match');

	t.end();
})


tape('teardown', function (t) {
	context.server.close()
	t.end()
})
