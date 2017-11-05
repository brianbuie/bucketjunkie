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
const http = require('http').Server(app);
const io = require('socket.io')(http);

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const webpackConfig = require('../webpack.config.js');
  const ip = require('ip').address();

  webpackConfig.entry.app.unshift(`webpack-dev-server/client?http://${ip}:8081`);
  webpackConfig.output.publicPath = `http://${ip}:8081/dist/`;
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

io.on('connection', function(socket) {
  console.log('user connected');
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
});

http.listen(process.env.PORT, function() {
  console.log(`Listening on PORT ${process.env.PORT}`);
});