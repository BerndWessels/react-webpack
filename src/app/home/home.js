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
import UpdatePersonMutation from '../../mutations/updatePersonMutation';

/**
 * Import UX components.
 */
import { Button, ButtonToolbar, ButtonGroup, DropdownButton, MenuItem, Glyphicon, Input } from 'react-bootstrap';

/**
 * The Home component.
 */
class Home extends React.Component {
  // Expected properties.
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };
  // Initialize the component.
  constructor(props) {
    super(props);
  }

  // Handle the button click event.
  _handleUpdatePerson = () => {
    Relay.Store.update(new UpdatePersonMutation({person: this.props.viewer, email: this.refs.email.value}));
  };
  // Handle the button click event.
  _handleMorePosts = () => {
    // read current params
    var count = this.props.relay.variables.numPosts;
    // update params
    this.props.relay.setVariables({
      numPosts: count + 1
    });
  };
  // Render the component.
  render() {
    return (
      <div>
        <h1>Home {this.props.viewer.email}</h1>
        <input ref="email" type="text" defaultValue={this.props.viewer.email}/>
        <Button onClick={this._handleUpdatePerson}>Update the email!</Button>
        <Button onClick={this._handleMorePosts}>count++</Button>
        <ul>
          {this.props.viewer.posts.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.title} (ID: {edge.node.id})</li>
          )}
        </ul>
      </div>
    );
  }
}

/**
 * The home data container.
 */
export default Relay.createContainer(Home, {
  initialVariables: {
    numPosts: 1
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Person {
        email,
        posts(first: $numPosts) {
          edges {
            cursor,
            node {
              id,
              title
            }
          }
        },
        ${UpdatePersonMutation.getFragment('person')}
      }
    `
  }
});
