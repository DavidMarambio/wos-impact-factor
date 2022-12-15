'use strict';

// Here's a JavaScript-based config file.
// If you need conditional logic, you might want to use this type of config.
// Otherwise, JSON or YAML is recommended.
module.exports = {
  require: ["ts-node/register", "test/hooks.ts"],
  exit: true,
  bail: true,
  diff: true,
  extension: ['js','ts'],
  opts: false,
  package: './package.json',
  reporter: 'spec',
  slow: 75,
  timeout: 100000,
  ui: 'bdd',
  spec: 'test/**/*.test.ts'
  //file: 'test'
};
