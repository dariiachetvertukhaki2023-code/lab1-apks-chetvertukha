#!/usr/bin/env node
'use strict';

const { getGreeting } = require('./hello');

function main(argv = process.argv.slice(2)) {
  const name = argv[0];
  console.log(name ? getGreeting(name) : getGreeting());
  return 0;
}

if (require.main === module) {
  process.exitCode = main();
}

module.exports = { main };
