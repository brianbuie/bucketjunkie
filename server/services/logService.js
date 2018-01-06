const chalk = require('chalk');
const moment = require('moment');
const log = console.log;

const handleInput = (input, force = false) => {
  if (!input) input = '(no message)';
  if (input.force) force = input.force;
  if (!process.env.DEBUG && !force) return false;
  let msg = moment().format('YYYY-MM-DD HH:mm:ss[: ]');
  if (typeof input === 'object') return msg + (input.msg || JSON.stringify(input));
  if (typeof input === 'array') return msg + input.join(', ');
  return msg + input;
}

exports.status = input => {
  let msg = handleInput(input);
  if (msg) log(chalk.gray(msg));
};

exports.info = input => {
  let msg = handleInput(input);
  if (msg) log(chalk.blue(msg));
}

exports.success = input => {
  let msg = handleInput(input);
  if (msg) log(chalk.green(msg));
};

exports.error = input => {
  let msg = handleInput(input, true);
  if (msg) log(chalk.red(msg));
};