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
import { Button, ButtonToolbar, ButtonGroup, DropdownButton, MenuItem, Glyphicon, Input } from 'react-bootstrap';

/**
 * The component.
 */
class Comment extends React.Component {
  // Expected properties.
  static propTypes = {
    comment: React.PropTypes.object.isRequired
  };
  // Initialize the component.
  constructor(props) {
    super(props);
  }
  // Render the component.
  render() {
    return (
      <li>{this.props.comment.content}</li>
    );
  }
}

/**
 * The data container.
 */
export default Relay.createContainer(Comment, {
  fragments: {
    comment: () => Relay.QL`
      fragment on Comment {
        id
        content
      }
    `
  }
});
