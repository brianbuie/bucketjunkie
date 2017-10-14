const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const LiveReloadPlugin = require('webpack-livereload-plugin');
const bootstrapEntryPoints = require('./webpack.bootstrap.config.js');

const isProd = process.env.NODE_ENV === 'production';

const sassResources = {
  loader: 'sass-resources-loader', 
  options: { 
    resources: [ 
      './client/src/sass/resources.scss' 
    ] 
  }
};

const cssDev = [ 'style-loader', 'css-loader?sourceMap', 'postcss-loader', 'sass-loader', sassResources ];

const cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [ 'css-loader', 'sass-loader', sassResources ],
  publicPath: '/client/public/dist'
});

const cssConfig = isProd ? cssProd : cssDev;
const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
  entry: {
    app: './client/src/index.js',
    bootstrap: bootstrapConfig,
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'client/public/dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      { test: /\.scss$/, use: cssConfig },
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(jpe?g|png|gif|svg)$/i, use: 'file-loader?name=images/[name].[ext]' },
      { test: /\.(woff2?)$/, use: 'url-loader?limit=10000&name=fonts/[name].[ext]' },
      { test: /\.(ttf|eot)$/, use: 'file-loader?name=fonts/[name].[ext]' },
      { test: /bootstrap\/dist\/js\/umd\//, use: 'imports-loader?jQuery=jquery' },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': "jquery",
      'jQuery': "jquery",
      "window.jQuery": "jquery",
      'Popper': 'popper.js',
      // Tether: "tether",
      // "window.Tether": "tether",
      // Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
      // Button: "exports-loader?Button!bootstrap/js/dist/button",
      // Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
      // Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
      // Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
      // Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
      // Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
      // Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
      // Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
      Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
      // Util: "exports-loader?Util!bootstrap/js/dist/util",
    }),
    new LiveReloadPlugin(),
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: !isProd,
      allChunks: true
    }),
    new webpack.LoaderOptionsPlugin({
      postcss: {},
    })
  ],
};
