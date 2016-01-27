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
import DeletePostMutation from '../../mutations/deletePostMutation';

/**
 * Import Components.
 */
import Comment from './comment';

/**
 * Import UX components.
 */
import { Button, ButtonToolbar, ButtonGroup, DropdownButton, MenuItem, Glyphicon, Input, ListGroupItem } from 'react-bootstrap';

/**
 * Import Internationalization.
 */
import {defineMessages, FormattedMessage} from 'react-intl';

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

  _handleDeletePost = () => {
    const { viewer, post } = this.props;
    // We commit the update directly to the database.
    Relay.Store.commitUpdate(new DeletePostMutation({viewer, post}), {
      onFailure: (err) => {
        // TODO: Deal with it!
        console.log(err);
      },
      onSuccess: (result) => {
        // TODO: Maybe nothing todo here?
      }
    });
  };
  // Render the component.
  render() {
    return (
      <ListGroupItem>
        <div>{this.props.post.title} - {this.props.post.content}</div>
        <Button onClick={this._handleDeletePost}>
          <FormattedMessage
            id="post.button.delete"
            description="The delete post button's text."
            defaultMessage="Delete"/>
        </Button>
        <ul>
          {this.props.post.comments.edges.map(edge =>
            <Comment key={edge.cursor} comment={edge.node}/>
          )}
        </ul>
      </ListGroupItem>
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
    viewer: () => Relay.QL`
      fragment on Person {
        ${DeletePostMutation.getFragment('viewer')}
      }`,
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
        ${DeletePostMutation.getFragment('post')}
      }`
  }
});
