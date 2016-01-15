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
 * Import Components.
 */
import Post from './post';

/**
 * Import UX components.
 */
import { Grid, Row, Col, PageHeader, Button, ButtonToolbar, ButtonGroup, DropdownButton, MenuItem, Glyphicon, Input, Pagination } from 'react-bootstrap';
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
  // Initialize the component.
  constructor(props) {
    super(props);
  }

  // Handle the button click event.
  _handleUpdatePerson = () => {
    // We commit the update directly to the database.
    Relay.Store.commitUpdate(new UpdatePersonMutation({
      person: this.props.viewer,
      email: this.refs.email.getValue()
    }), {
      onFailure: (err) => {
        // TODO: Deal with it!
        console.log(err);
      },
      onSuccess: (result) => {
        // TODO: Maybe nothing todo here?
      }
    });
  };
  // The user changed the posts page size.
  _handlePostsPageSizeChange = (e) => {
    var val = parseInt(e.target.value);
    if (isNaN(val)) {
      return;
    }
    // update relay query parameters
    this.props.relay.setVariables({
      limit: val
    });
  };
  // The user changed the current posts page index.
  _handlePostsPageIndexChange = (e, pagingEvent) => {
    // update relay query parameters
    this.props.relay.setVariables({
      offset: (pagingEvent.eventKey - 1) * this.props.relay.variables.limit
    });
  };
  // Render the component.
  render() {
    // Calculate stuff.
    var postsPageSize = this.props.relay.variables.limit;
    var totalPostsPages = Math.floor(this.props.viewer.posts.totalCount / postsPageSize);
    var currentPostsPage = Math.floor(this.props.viewer.posts.pageInfo.startCursor / postsPageSize);
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
              </PageHeader>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Pagination
                first
                last
                prev
                next
                ellipsis
                items={totalPostsPages}
                maxButtons={3}
                activePage={currentPostsPage + 1}
                onSelect={this._handlePostsPageIndexChange}/>
            </Col>
            <Input ref="pageSize" type="number" label="Posts per page"
                   defaultValue={this.props.relay.variables.limit} onChange={this._handlePostsPageSizeChange}
                   labelClassName="col-xs-2" wrapperClassName="col-xs-4"/>

          </Row>
          <Row>
            <ul>
              {this.props.viewer.posts.edges.map(edge =>
                <Post key={edge.cursor} post={edge.node}/>
              )}
            </ul>
          </Row>
          <Row>
            <Col xs={12}>
              <PageHeader>
                <FormattedMessage
                  id="home.email"
                  description="Test Section"
                  defaultMessage="Change your account details"
                  values={{firstName: this.props.viewer.firstName, lastName: this.props.viewer.lastName}}
                />
              </PageHeader>
              <Input ref="email" type="text" label="Email" defaultValue={this.props.viewer.email}/>
              <Button onClick={this._handleUpdatePerson}>Update the email!</Button>
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
        },
        ${UpdatePersonMutation.getFragment('person')}
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
