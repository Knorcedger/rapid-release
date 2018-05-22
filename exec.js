const util = require('util');
const execute = util.promisify(require('child_process').exec);

const exec = async command => {
  let result;

  try {
    result = await execute(command);
  } catch(error) {
    console.error(`Error executing: ${command}`, error)
  }

  return result;
};

module.exports = exec;
