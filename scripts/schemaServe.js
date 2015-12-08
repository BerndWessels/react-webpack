/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import cors from 'cors';
import express from'express';
import graphQLHTTP from'express-graphql';
import {Schema} from '../data/schema';
import task from './lib/task';

/**
 * Serves the GraphQL data endpoint.
 */
export default task('serve data', async () => {
  // Development data port.
  const GRAPHQL_PORT = 8088;

  // Create a GraphQL endpoint.
  var graphQLServer = express();
  /* TODO authentication
  graphQLServer.use(function (req, res, next) {
    // Allow all CORS requests.
    if (req.headers.hasOwnProperty('access-control-request-method')) {
      next();
    }
    // Process authentication on all GraphQL requests.
    else {
      // TODO get the session info from REDIS using the authorization header as key and session as value to retrieve.
      var redis = {'1234567890': {userId: 1}};
      var session = redis[req.headers['authorization']];
      if (session) {
        req.session = session;
        next();
      } else {
        res.status(401).send({error: 'Something blew up!'});
      }
    }
  });
  */

  // Enable CORS during development.
  graphQLServer.use(cors());
  // Log every incoming query.
  graphQLServer.use((req, res, next) => {
    console.log('Time:', Date.now());
    next();
  });
  // Expose the GraphQL endpoint.
  graphQLServer.use('/', graphQLHTTP(request => ({
    schema: Schema,
    rootValue: {session: {userId: 1}},//request.session},
    pretty: true,
    graphiql: true
  })));
  // Run the server.
  graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
  ));
});

// https://github.com/graphql/express-graphql todo authentication
