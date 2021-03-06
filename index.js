#!/usr/bin/env node

const program = require('commander');
const {version} = require('./package.json');
const exec = require('./exec');
const {validateVersion} = require('./validator');

// set default releaseVersion
let releaseVersion = 'patch';

program
  .version(version)
  .arguments('<cmd>')
  .action(cmd => releaseVersion = cmd)
  .option('-s, --skip-tests', 'Skip tests')
  .option('-p, --npm-publish', 'npm publish')
  .parse(process.argv);

const versionError = validateVersion(releaseVersion);
if (versionError) {
  throw new Error(versionError);
} else {
  console.log(`Releasing version ${releaseVersion}`);
}

const getCurrentBranch = async () => {
  let name = '';

  try {
    name = await exec('git rev-parse --abbrev-ref HEAD');
    name = name.stdout.replace('\n', '');
  } catch (error) {
    throw new Error('Are we in a git repo?');
  }

  return name;
};

const run = async () => {
  // get current branch name
  const currentBranch = await getCurrentBranch();
  if (currentBranch.substr(0, 3).toLowerCase() !== 'dev') {
    console.log('Abort: We are not in develop branch');
    throw new Error('Abort: We are not in develop branch');
  }

  // tests
  if (program.skipTests) {
    console.log('Skipping tests!');
  } else {
    await exec('npm test');
  }

  // pull first
  await exec('git pull');

  // npm version
  await exec(`npm version ${releaseVersion}`);

  // push
  await exec('git push');

  // push tags
  await exec('git push --follow-tags');

  // checkout to master
  await exec('git checkout master');

  // pull master
  await exec('git pull');

  // merge currentBranch in master
  await exec(`git merge ${currentBranch}`);

  // push master
  await exec('git push');

  // npm publish
  if (program.npmPublish) {
    console.log('Publishing on npm!');
    await exec('npm publish');
  }

  // checkout to currentBranch
  await exec(`git checkout ${currentBranch}`);

  console.log('Done! Check above for errors.');
};

run();

// catch any uncaught exceptions
process.on('uncaughtException', () => {
  // console.error('Problem: uncaughtException', err);
});

process.on('unhandledRejection', () => {
  // console.error('Problem: Unhandled Rejection at: Promise', p, 'reason:', reason);
});
