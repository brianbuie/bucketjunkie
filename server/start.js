const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', 'variables.env') });

mongoose.connect(process.env.DATABASE, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🚫 → ${err.message}`);
});

require('./models/User');
require('./models/Activity');
require('./models/Player');
require('./models/Team');
require('./models/Game');
require('./models/Roster');
require('./models/Draft');
require('./models/League');
require('./models/Score');
require('./models/Box');

const app = require('./app');

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const webpackConfig = require('../webpack.config.js');

  webpackConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:8081");
  const devServer = new WebpackDevServer(webpack(webpackConfig), {
    contentBase: path.resolve(__dirname, '..', 'client/public/dist/'),
    hot: false,
    quiet: false,
    noInfo: false,
    publicPath: '/dist/',
    stats: "minimal",
    headers: { "Access-Control-Allow-Origin": "*" }
  });
  devServer.listen(8081, () => console.log(`Webpack running → PORT 8081`));
}

app.set('port', 8080);
app.listen(app.get('port'), () => console.log(`Express running → PORT ${app.get('port')}`));