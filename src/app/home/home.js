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
import Post from './post';

/**
 * Import UX components.
 */
import {
  Grid, Row, Col, PageHeader, Button, ButtonToolbar, ButtonGroup, DropdownButton, MenuItem,
  Glyphicon, Input, Pagination, ListGroup, ListGroupItem
} from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap';

/**
 * Import Internationalization.
 */
import {FormattedNumber, FormattedMessage} from 'react-intl';

/**
 * The component.
 */
class Home extends React.Component {
  // Expected properties.
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  // Expected context properties.
  static contextTypes = {
    storeSession: React.PropTypes.func,
    restoreSession: React.PropTypes.func
  };

  // Initialize the component.
  constructor(props) {
    super(props);
    // Default state.
    this.state = {
      postsPage: 1,
      postsPageSize: 2,
      postsTotalPages: 5
    };
  }

  // Invoked once, both on the client and server, immediately before the initial rendering occurs.
  // If you call setState within this method,
  // render() will see the updated state and will be executed only once despite the state change.
  componentWillMount() {
    // Restore the previous session if any.
    this.context.restoreSession(this.props.location.pathname, this);
  }

  // Invoked when a component is receiving new props. This method is not called for the initial render.
  // Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState().
  // The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render.
  componentWillReceiveProps(nextProps, nextContext) {
    // Update the state.
    this.setState({
      postsPage: Math.floor(nextProps.relay.variables.offset / nextProps.relay.variables.limit) + 1,
      postsPageSize: nextProps.relay.variables.limit,
      postsTotalPages: Math.ceil(nextProps.viewer.posts.totalCount / nextProps.relay.variables.limit)
    });
    // Update the session store for this page.
    this.context.storeSession(this.props.location.pathname, {
      relay: {offset: nextProps.relay.variables.offset, limit: nextProps.relay.variables.limit}
    });
  }

  // The user changed the posts page size.
  _handlePostsPageSizeChange = (e, eventKey) => {
    // update relay query parameters
    this.props.relay.setVariables({
      limit: eventKey
    });
  };
  // The user changed the current posts page index.
  _handlePostsPageIndexChange = (e, pagingEvent) => {
    // update relay query parameters
    this.props.relay.setVariables({
      offset: (pagingEvent.eventKey - 1) * this.state.postsPageSize
    });
  };
  // Render the component.
  render() {
    // Calculate stuff.
    return (
      <form>
        <Grid>
          <Row>
            <Col xs={12}>
              <PageHeader>
                <FormattedMessage
                  id="home.greeting"
                  description="Welcome greeting to the user"
                  defaultMessage="Welcome {firstName} {lastName}!"
                  values={{firstName: this.props.viewer.firstName, lastName: this.props.viewer.lastName}}
                />
                <span>{this.props.viewer.posts.totalCount}</span>
              </PageHeader>
            </Col>
          </Row>
          <Row style={{marginBottom: 10}}>
            <Col xs={12}>
              <Pagination first last prev next ellipsis maxButtons={3}
                          items={this.state.postsTotalPages}
                          activePage={this.state.postsPage}
                          onSelect={this._handlePostsPageIndexChange}/>
              <DropdownButton id="postsPageSizeDropdown" onSelect={this._handlePostsPageSizeChange}
                              className="pagination-dropdown" bsStyle="default" title={this.state.postsPageSize}
                              style={{marginLeft: 5}}>
                <MenuItem eventKey={1} active={this.state.postsPageSize == 1}>1</MenuItem>
                <MenuItem eventKey={2} active={this.state.postsPageSize == 2}>2</MenuItem>
                <MenuItem eventKey={3} active={this.state.postsPageSize == 3}>3</MenuItem>
              </DropdownButton>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <ListGroup>
                {this.props.viewer.posts.edges.map(edge =>
                  <Post key={edge.cursor} viewer={this.props.viewer} post={edge.node}/>
                )}
              </ListGroup>
            </Col>
          </Row>
        </Grid>
      </form>
    );
  }
}

/**
 * The data container.
 */
export default Relay.createContainer(Home, {
  initialVariables: {
    limit: 2,
    offset: 0
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Person {
        firstName
        lastName
        email
        posts(limit: $limit, offset: $offset) {
          ${postsFragment}
        }
         ${Post.getFragment('viewer')}
      }`
  }
});

var postsFragment = Relay.QL`
  fragment on postConnection {
    edges {
      cursor
      node {
        ${Post.getFragment('post')}
      }
    }
    totalCount
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }`;
