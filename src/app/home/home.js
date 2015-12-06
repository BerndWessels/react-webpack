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

import { Button, ButtonToolbar, ButtonGroup, DropdownButton, MenuItem, Glyphicon, Input } from 'react-bootstrap';



class UpdatePersonMutation extends Relay.Mutation {
  // This method should return a GraphQL operation that represents
  // the mutation to be performed. This presumes that the server
  // implements a mutation type named ‘likeStory’.
  getMutation() {
    return Relay.QL`mutation {updatePerson}`;
  }
  // Use this method to prepare the variables that will be used as
  // input to the mutation. Our ‘likeStory’ mutation takes exactly
  // one variable as input – the ID of the story to like.
  getVariables() {
    return {id: this.props.person.id, email: this.props.email};
  }
  // Use this method to design a ‘fat query’ – one that represents every
  // field in your data model that could change as a result of this mutation.
  // Liking a story could affect the likers count, the sentence that
  // summarizes who has liked a story, and the fact that the viewer likes the
  // story or not. Relay will intersect this query with a ‘tracked query’
  // that represents the data that your application actually uses, and
  // instruct the server to include only those fields in its response.
  getFatQuery() {
    return Relay.QL`
      fragment on UpdatePersonPayload {
        person {
          email,
        }
      }
    `;
  }
  // These configurations advise Relay on how to handle the LikeStoryPayload
  // returned by the server. Here, we tell Relay to use the payload to
  // change the fields of a record it already has in the store. The
  // key-value pairs of ‘fieldIDs’ associate field names in the payload
  // with the ID of the record that we want updated.
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        person: this.props.person.id,
      },
    }];
  }
  // This mutation has a hard dependency on the story's ID. We specify this
  // dependency declaratively here as a GraphQL query fragment. Relay will
  // use this fragment to ensure that the story's ID is available wherever
  // this mutation is used.
  static fragments = {
    person: () => Relay.QL`
      fragment on Person {
        id,
        email
      }
    `,
  };

  getOptimisticResponse() {
    return {
      person: {
        id: this.props.person.id,
        email: this.props.email,
      },
    };
  }
}



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
  _handleClick = () => {
    Relay.Store.update(new UpdatePersonMutation({person: this.props.viewer, email: 'bla@blub.de'}));
  }
  // Render the component.
  render() {
    return (
      <div>
        <h1>Home {this.props.viewer.email}</h1>
        <input type="text" defaultValue={this.props.viewer.email}/>
        <Button onClick={this._handleClick}>Update the email!</Button>
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
  fragments: {
    viewer: () => Relay.QL`
      fragment on Person {
        email,
        posts {
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
