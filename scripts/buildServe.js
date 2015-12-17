/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import express from'express';
import task from './lib/task';

/**
 * Serves the production build.
 */
export default task('serve build', async () => {
  // Development data port.
  const PORT = 8080;
  // Create an endpoint.
  var server = express();
  // Serve the static build files.
  server.use(express.static(path.resolve(__dirname, '../dist')));
  // Log every incoming query.
  server.use((req, res, next) => {
    console.log('Time:', Date.now());
    next();
  });
  // Run the server.
  server.listen(PORT, () => console.log(
    `Server is now running on http://localhost:${PORT}`
  ));
});
