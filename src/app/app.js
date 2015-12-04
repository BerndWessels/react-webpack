/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

/**
 * The application component.
 */
class App extends React.Component {
  // Expected properties.
  static propTypes = {
    viewer: React.PropTypes.object.isRequired,
    children: React.PropTypes.node.isRequired
  };
  // Initialize the component.
  constructor(props) {
    super(props);
  }

  // Render the component.
  render() {
    // Get the properties.
    const {viewer, children} = this.props;
    // Return the component UI.
    return (
      <div>
        <h1>App</h1>
        <Link to={`/`} activeClassName="home">Home</Link>
        <Link to={`/users`} activeClassName="active">Users</Link>
        {children}
      </div>
    );
  }
}

/**
 * The application data container.
 */
export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
          fragment on Person {
            id
          }
        `
  }
});
