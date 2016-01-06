/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {RelayRouter} from 'react-router-relay';
import ReactRouterRelay from 'react-router-relay';
import { browserHistory } from 'react-router';

/**
 * Import Routes.
 */
import routes from './routes';

/**
 * Import Styles.
 */
import styles from './index.less';

/**
 * The entry point of the application.
 */

// TODO: Inject the GraphQL endpoint by the build process.
Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:8088', {
    headers: {
      // TODO: Add your own authentication mechanism here.
      Authorization: '1234567890'
    }
  })
);

// Render and run the application.
ReactDOM.render(
  <RelayRouter
    history={browserHistory}
    routes={routes}
  />,
  document.getElementById('root')
);
