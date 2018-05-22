const semver = require('semver');

const validVersions = ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease'];
const validateVersion = version => {
  let error;
  if (!validVersions.includes(version) && !semver.valid(version)) {
    error = 'Invalid version. Valid versions are: major, minor, patch, premajor, preminor, prepatch, prerelease, 1.2.3';
  }

  return error;
};

module.exports = {
  validateVersion
};
