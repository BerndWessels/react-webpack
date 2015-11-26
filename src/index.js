/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import createHistory from 'history/lib/createBrowserHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {RelayRouter} from 'react-router-relay';
import ReactRouterRelay from 'react-router-relay';
import routes from './routes';

import styles from './index.less';

/**
 * The entry point of the application.
 */

// TODO: Inject the GraphQL endpoint from the build process.
Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:8088', {
    headers: {
      Authorization: '1234567890'
    }
  })
);

// Use HTML5 browser history navigation.
const history = createHistory();

// Render and run the application.
ReactDOM.render(
  <RelayRouter
    history={history}
    routes={routes}
    />,
  document.getElementById('root')
);
