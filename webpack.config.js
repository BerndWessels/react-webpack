/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Webpack config for development
 */

// Force development mode for all build components.
process.env['BABEL_ENV'] = 'development';
process.env['NODE_ENV'] = 'development';

module.exports = require('./webpack.make')({
  BUILD: false,
  TEST: false,
  TRANSLATE: false
});
