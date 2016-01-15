/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Webpack config
 */

// Modules
var fs = require('fs');

var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function makeWebpackConfig(options) {
  /**
   * Environment type
   * BUILD is for generating minified builds
   * TEST is for generating test builds
   */
  var BUILD = !!options.BUILD;
  var TEST = !!options.TEST;
  var TRANSLATE = !!options.TRANSLATE;

  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  if (TEST) {
    config.entry = {}
  } else {
    config.entry = {
      app: './src/index.js'
    }
  }

  /**
   * Externals
   * Reference: http://webpack.github.io/docs/configuration.html#externals
   */
  config.externals = {
    "react": "React",
    "react-dom": "ReactDOM",
    "react-relay": "Relay"
  };

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  if (TEST) {
    config.output = {};
  } else if (TRANSLATE) {
    config.output = {
      // Absolute output directory
      path: __dirname + '/build/public',

      // Output path from the view of the page
      // Uses webpack-dev-server in development
      publicPath: '',

      // Filename for entry points
      // Only adds hash in build mode
      filename: '[name].bundle.js',

      // Filename for non-entry points
      // Only adds hash in build mode
      chunkFilename: '[name].bundle.js'
    };
  } else {
    config.output = {
      // Absolute output directory
      path: BUILD ? __dirname + '/dist' : __dirname + '/public',

      // Output path from the view of the page
      // Uses webpack-dev-server in development
      publicPath: BUILD ? '' : '', // http://localhost:8080/',

      // Filename for entry points
      // Only adds hash in build mode
      filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

      // Filename for non-entry points
      // Only adds hash in build mode
      chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
    };
  }

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (TEST) {
    config.devtool = 'inline-source-map';
  } else if (BUILD) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval';
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

    // Initialize module
  config.module = {
    preLoaders: [],
    loaders: [{
      // JS LOADER
      // Reference: https://github.com/babel/babel-loader
      // Transpile .js files using babel-loader
      // Compiles ES6 and ES7 into ES5 code
      test: /\.js$/,
      loader: 'babel',
      exclude: /(node_modules|bower_components)/
    }, {
      // ASSET FONT LOADER
      // Reference: https://github.com/webpack/file-loader
      // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
      // Rename the file using the asset hash
      // Pass along the updated reference to your code
      // You can add here any file extension you want to get copied to your output
      test: /\.(svg|woff|woff2|ttf|eot)$/,
      loader: 'file?name=assets/fonts/[name].[hash].[ext]'
    }, {
      // ASSET IMAGE LOADER
      // Reference: https://github.com/webpack/file-loader
      // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
      // Rename the file using the asset hash
      // Pass along the updated reference to your code
      // You can add here any file extension you want to get copied to your output
      test: /\.(png|jpg|jpeg|gif)$/,
      loader: 'file?name=assets/images/[name].[hash].[ext]'
    }, {
      // HTML LOADER
      // Reference: https://github.com/webpack/raw-loader
      // Allow loading html through js
      test: /\.html$/,
      loader: 'raw'
    }, {
      // JSON LOADER
      // Reference: https://github.com/webpack/json-loader
      // Allow loading JSNO
      test: /\.json$/,
      loader: 'json'
    }
    ]
  };

  // ISPARTA LOADER
  // Reference: https://github.com/ColCh/isparta-instrumenter-loader
  // Instrument JS files with Isparta for subsequent code coverage reporting
  // Skips node_modules and files that end with .test.js
  if (TEST) {
    config.module.preLoaders.push({
      test: /\.js$/,
      exclude: [
        /(node_modules|bower_components)/,
        /\.test\.js$/
      ],
      loader: 'isparta-instrumenter'
    })
  }

  // LESS LOADER
  // Reference: https://github.com/webpack/less-loader
  // Allow loading less/css through js
  // Reference: https://github.com/postcss/postcss-loader
  // Postprocess your less/css with PostCSS plugins
  var lessLoader = {
    test: /\.less$/,
    // Reference: https://github.com/webpack/style-loader
    // Use style-loader in development for hot-loading
    loader: (!BUILD || TEST) ? 'style!css!less!postcss' :
      // Reference: https://github.com/webpack/extract-text-webpack-plugin
      // Extract less/css files in production builds
      ExtractTextPlugin.extract(
        // activate source maps via loader query
        'css?sourceMap!less?sourceMap!postcss'
      )
  };

  // Skip loading css in test mode
  if (TEST || TRANSLATE) {
    // Reference: https://github.com/webpack/null-loader
    // Return an empty module
    lessLoader.loader = 'null'
  }

  // Add cssLoader to the loader list
  config.module.loaders.push(lessLoader);

  /**
   * PostCSS
   * Reference: https://github.com/postcss/autoprefixer-core
   * Add vendor prefixes to your css
   */
  config.postcss = [
    autoprefixer({
      browsers: ['last 2 version']
    })
  ];

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin('[name].[hash].css', {
      disable: !BUILD || TEST || TRANSLATE
    })
  ];

  // Skip rendering index.html in test mode
  if (!TEST && !TRANSLATE) {
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    config.plugins.push(
      new HtmlWebpackPlugin({
        title: 'webpack',
        template: './src/index.html'
      })
    )
  }

  // Add build specific plugins
  if (BUILD) {
    // Reference: https://github.com/jeffling/ng-annotate-webpack-plugin
    // Make Angular Injections minification safe
    config.plugins.push(
      // Reference: https://github.com/johnagan/clean-webpack-plugin
      // Clean the output folders before building
      new CleanWebpackPlugin(['dist', 'build'], __dirname),
      // Reference: https://github.com/kevlened/copy-webpack-plugin
      // Copy the public folder to the dist folder
      new CopyWebpackPlugin([
        {from: 'public'}
      ]),
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // Dedupe modules in the output
      new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin()
    )
  }

  // Add dev specific plugins
  if (!TEST && !TRANSLATE && !BUILD) {
    config.plugins.push(
      // https://webpack.github.io/docs/list-of-plugins.html#occurenceorderplugin
      new webpack.optimize.OccurenceOrderPlugin(),
      // Reference: https://github.com/gaearon/react-hot-loader/issues/127
      // https://webpack.github.io/docs/list-of-plugins.html#hotmodulereplacementplugin
      // new webpack.HotModuleReplacementPlugin(),
      // https://github.com/webpack/webpack/issues/701
      new webpack.OldWatchingPlugin(),
      // https://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      new webpack.optimize.DedupePlugin(),
      // https://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      new webpack.NoErrorsPlugin(),
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new BrowserSyncPlugin(
        {
          host: 'localhost',
          port: 3000,
          proxy: 'http://localhost:8080/'
        },
        {
          // determines if browserSync should take care
          // of reload (defaults to true). switching it off
          // might be useful if you combine this plugin
          // with webpack-dev-server to reach
          // Hot Loader/Hot Module Replacement tricks
          reload: false
        })
    )
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: './public',
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false
    }
    /**
     * Add your own certificates for https here.
     * cert: fs.readFileSync('certificates/my-domain.crt'),
     * key: fs.readFileSync('certificates/my-domain.decrypted.key')
     */
  };

  return config;
};
