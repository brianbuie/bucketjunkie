const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');
const ip = require('ip').address();
const port = process.env.WEBPACK_PORT;

webpackConfig.entry.app.unshift(`webpack-dev-server/client?http://${ip}:${port}`);
webpackConfig.output.publicPath = `http://${ip}:${port}/dist/`;

const devServer = new WebpackDevServer(webpack(webpackConfig), {
  contentBase: path.resolve(__dirname, '..', 'client/public/dist/'),
  hot: false,
  quiet: false,
  noInfo: false,
  publicPath: '/dist/',
  stats: "minimal",
  headers: { "Access-Control-Allow-Origin": "*" }
});

devServer.listen(port, () => console.log(`Webpack running → PORT ${port}`));