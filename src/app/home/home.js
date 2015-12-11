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
    Relay.Store.update(new UpdatePersonMutation({person: this.props.viewer, email: this.refs.email.getValue()}));
  };
  // Handle the button click event.
  _handleGetPrevPage = () => {
    // update relay query parameters
    this.props.relay.setVariables({
      forward: false,
      first: null,
      after: null,
      last: this.refs.pageSize.getValue(),
      before: this.props.viewer.posts.pageInfo.startCursor
    });
  };
  // Handle the button click event.
  _handleGetNextPage = () => {
    // read current params
    // var count = this.props.relay.variables.postsPerPage;
    // update params
    this.props.relay.setVariables({
      forward: true,
      first: this.refs.pageSize.getValue(),
      after: this.props.viewer.posts.pageInfo.endCursor,
      last: null,
      before: null
    });
  };
  // Render the component.
  render() {
    return (
      <div>
        <h1>Home {this.props.viewer.firstName} - {this.props.viewer.email}</h1>
        <Input ref="email" type="text" label="Email" defaultValue={this.props.viewer.email}/>
        <Button onClick={this._handleUpdatePerson}>Update the email!</Button>
        <Input ref="pageSize" type="text" label="Posts per page"
               defaultValue={this.props.relay.variables.first}/>
        <Button onClick={this._handleGetPrevPage}>Get Prev Page</Button>
        <Button onClick={this._handleGetNextPage}>Get Next Page</Button>
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
    forward: true,
    first: 2,
    after: null,
    last: null,
    before: null
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Person {
        firstName
        email
        posts(first: $first, after: $after) @include(if: $forward) {
          edges {
            cursor
            node {
              id
              title
            }
          }
          totalCount
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        },
        posts(last: $last, before: $before) @skip(if: $forward) {
          edges {
            cursor
            node {
              id
              title
            }
          }
          totalCount
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        },
        ${UpdatePersonMutation.getFragment('person')}
      }
    `
  }
});
