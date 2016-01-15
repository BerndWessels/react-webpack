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

/**
 * Import Mutations.
 */

/**
 * Import Components.
 */

/**
 * Import UX components.
 */
import { Grid, Row, Col } from 'react-bootstrap';

/**
 * Import Internationalization.
 */
import {FormattedMessage} from 'react-intl';

/**
 * The component.
 */
class Users extends React.Component {
  // Expected properties.
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };
  // Initialize the component.
  constructor(props) {
    super(props);
  }

  // Render the component.
  render() {
    // Return the component UI.
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h1>
              <FormattedMessage
                id="users.title"
                description="The users-feature title"
                defaultMessage="Users List"
              />
            </h1>
            <ul>
              {this.props.viewer.id}
            </ul>
          </Col>
        </Row>
      </Grid>
    );
  }
}

/**
 * The users data container.
 */
export default Relay.createContainer(Users, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Person {
        id
      }
    `
  }
});
