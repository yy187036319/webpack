const webpack = require("webpack"); 
const WebpackDevServer = require('webpack-dev-server');

const config = require('./webpack.config.js');
const webpackConfig = require("./webpack.dev.js");


const compiler = webpack(webpackConfig);
const devServerOptions = Object.assign({}, webpackConfig.devServer);
const server = new WebpackDevServer(compiler, devServerOptions);


server.listen(config.port, config.host, res => {});