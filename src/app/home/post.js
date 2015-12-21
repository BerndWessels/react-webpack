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
import Comment from './comment';

/**
 * Import UX components.
 */
import { Button, ButtonToolbar, ButtonGroup, DropdownButton, MenuItem, Glyphicon, Input } from 'react-bootstrap';

/**
 * The component.
 */
class Post extends React.Component {
  // Expected properties.
  static propTypes = {
    post: React.PropTypes.object.isRequired
  };
  // Initialize the component.
  constructor(props) {
    super(props);
  }
  // Render the component.
  render() {
    return (
      <li>
        <div>{this.props.post.title} - {this.props.post.content}</div>
        <ul>
          {this.props.post.comments.edges.map(edge =>
            <Comment key={edge.cursor} comment={edge.node}/>
          )}
        </ul>
      </li>
    );
  }
}

/**
 * The data container.
 */
export default Relay.createContainer(Post, {
  initialVariables: {
    first: 3
  },
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
        id
        title
        content
        comments(first: $first) {
          edges {
            cursor
            node {
              ${Comment.getFragment('comment')}
            }
          }
          totalCount
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `
  }
});
