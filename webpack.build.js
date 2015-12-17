/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Webpack config for builds
 */

// Force production mode for all build components.
process.env['BABEL_ENV'] = 'production';
process.env['NODE_ENV'] = 'production';

module.exports = require('./webpack.make')({
  BUILD: true,
  TEST: false
});
