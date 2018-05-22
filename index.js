// npm test && npm version patch && git push && git push --follow-tags && git checkout master && git pull && git merge develop && git push && git checkout develop
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
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
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
  } catch(error) {
    throw new Error('Are we in a git repo?');
  }

  return name;
}


const run = async () => {
  // get current branch name
  const currentBranch = await getCurrentBranch();
  // console.log('currentBranch', currentBranch);

  // tests
  if (program.skipTests) {
    console.log('Skipping tests!');
  } else {
    await exec(`npm test`);
  }

  // npm version
  await exec(`npm version ${releaseVersion}`);

  // push
  await exec(`git push`);

  // push tags
  await exec('git push --follow-tags');

  // checkout to master
  await exec('git checkout master');

  // pull master
  await exec('git pull');

  // merge develop in master
  await exec('git merge develop');

  // push master
  await exec('git push');

  // checkout to develop
  await exec('git checkout develop');
};

run();

// catch any uncaught exceptions
process.on('uncaughtException', err => {
  console.error('Problem: uncaughtException', err);
});

process.on('unhandledRejection', (reason, p) => {
  console.error('Problem: Unhandled Rejection at: Promise', p, 'reason:', reason);
});
