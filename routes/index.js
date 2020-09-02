const { Router } = require('express');
const bent = require('bent');

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

    const [version, subversion, bugfix] = versionData.version.split('.');


    if (!minimumSecure[version]) {
      minimumSecure[version] = versionData
      return;
    }

    if (minimumSecure[version].version.split('.')[1] < subversion) {
      minimumSecure[version] = versionData
      return;
    }
    if (minimumSecure[version].version.split('.')[2] < bugfix) {
      minimumSecure[version] = versionData
      return;
    }
  })
  return res.json(minimumSecure);
})

router.get('/latest-releases', async (req, res) => {
  const getJson = bent('json');
  const nodeVersionJson = await getJson('https://nodejs.org/dist/index.json');

  const latestVersion = {};
  nodeVersionJson.forEach(versionData => {
    const [version, subversion, bugfix] = versionData.version.split('.');


    if (!latestVersion[version]) {
      latestVersion[version] = versionData
      return;
    }

    if (latestVersion[version].version.split('.')[1] < subversion) {
      latestVersion[version] = versionData
      return;
    }
    if (latestVersion[version].version.split('.')[2] < bugfix) {
      latestVersion[version] = versionData
      return;
    }
  })
  return res.json(latestVersion);
})

module.exports = router;