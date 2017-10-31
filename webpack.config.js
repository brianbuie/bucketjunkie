const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'variables.env') });
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;

const isProd = process.env.NODE_ENV === 'production';
console.log(`Webpack building in ${process.env.NODE_ENV} mode`);

const sassResources = {
  loader: 'sass-resources-loader', 
  options: { 
    resources: [ 
      './client/src/sass/variables.scss' 
    ] 
  }
};

const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: loader => [
      require('autoprefixer')({ browsers: ['last 3 versions'] }),
    ]
  }
}

const cssDev = [ 'style-loader', 'css-loader?sourceMap', postCssLoader, 'sass-loader', sassResources ];

const cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [ 'css-loader', 'sass-loader', sassResources ],
  publicPath: '/dist/'
});

const cssConfig = isProd ? cssProd : cssDev;

module.exports = {
  entry: {
    app: ['./client/src/index.js'],
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'client/public/dist/'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.scss$/, use: cssConfig },
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(jpe?g|png|gif|svg)$/i, use: 'file-loader?name=images/[name].[ext]' },
      { test: /\.(woff2?)$/, use: 'url-loader?limit=10000&name=fonts/[name].[ext]' },
      { test: /\.(ttf|eot)$/, use: 'file-loader?name=fonts/[name].[ext]' },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
      'jQuery': path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
      "window.jQuery": path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
      'Popper': ['popper.js', 'default'],
      "window.Popper": 'popper.js',
      "moment": "moment",

      // bootstrap stuff
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
      // Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
      // Util: "exports-loader?Util!bootstrap/js/dist/util",
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: !isProd,
      allChunks: true
    }),
    new WebpackBundleSizeAnalyzerPlugin('./bundle-size-report.txt')
  ],
};
