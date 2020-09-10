const ora = require('ora');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackConfig = require("./webpack.prod.js");

process.stderr.write(chalk.blueBright.bold(` build start ..... \n\n`));
webpack(webpackConfig, (err, state) => {});

