const { Router } = require('express');
const bent = require('bent');
const semver = require('semver');

const { dependencies } = require('../package.json');

const router = new Router();

router.get('/dependencies', (req, res) => {
  const dependenciesArray = Object.entries(dependencies);

  const dependenciesFormatted = [];
  dependenciesArray.forEach(dep => {
    dependenciesFormatted.push(`${dep[0]}\t-\t${dep[1]}`);
  })

  return res.render('dependencies', { dependencies: dependenciesFormatted });
})


router.get('/minimum-secure', async (req, res) => {
  const getJson = bent('json');
  const nodeVersionJson = await getJson('https://nodejs.org/dist/index.json');

  const minimumSecure = {};

  nodeVersionJson.reverse().forEach(versionData => {
    if (!versionData.security) {
      return;
    }
    const version = `v${semver.major(versionData.version)}`;
    const minor = semver.minor(versionData.version);
    const patch = semver.patch(versionData.version)


    if (!minimumSecure[version]) {
      minimumSecure[version] = versionData
      return;
    }

    if (minor > semver.minor(minimumSecure[version].version)) {
      minimumSecure[version] = versionData
      return;
    }
    if (minor === semver.minor(minimumSecure[version].version)) {
      if (patch > semver.patch(minimumSecure[version].version)) {
        minimumSecure[version] = versionData
        return;
      }
    }
  })
  return res.json(minimumSecure);
})

router.get('/latest-releases', async (req, res) => {
  const getJson = bent('json');
  const nodeVersionJson = await getJson('https://nodejs.org/dist/index.json');

  const latestVersion = {};

  nodeVersionJson.forEach(versionData => {
    const version = `v${semver.major(versionData.version)}`;
    const minor = semver.minor(versionData.version);
    const patch = semver.patch(versionData.version)


    if (!latestVersion[version]) {
      latestVersion[version] = versionData
      return;
    }

    if (minor > semver.minor(latestVersion[version].version)) {
      latestVersion[version] = versionData
      return;
    }
    if (minor === semver.minor(latestVersion[version].version)) {
      if (patch > semver.patch(latestVersion[version].version)) {
        latestVersion[version] = versionData
        return;
      }
    }

  })
  return res.json(latestVersion);
})

module.exports = router;