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
 * Create the GraphQL Mutation.
 */
class UpdatePersonMutation extends Relay.Mutation {
  // This method should return a GraphQL operation that represents
  // the mutation to be performed. This presumes that the server
  // implements a mutation type named ‘updatePerson‘.
  getMutation() {
    return Relay.QL`mutation {updatePerson}`;
  }

  // Use this method to prepare the variables that will be used as
  // input to the mutation. Our ‘updatePerson’ mutation takes exactly
  // one variable as input – the ID of the story to like.
  getVariables() {
    return {
      id: this.props.person.id,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      email: this.props.email,
      language: this.props.language
    };
  }

  // Use this method to design a ‘fat query’ – one that represents every
  // field in your data model that could change as a result of this mutation.
  // Mutating an entity could affect a lot of other entities.
  // Relay will intersect this query with a ‘tracked query’
  // that represents the data that your application actually uses, and
  // instruct the server to include only those fields in its response.
  getFatQuery() {
    return Relay.QL`
      fragment on UpdatePersonPayload {
        person {
          firstName
          lastName
          email
          language
        }
      }
    `;
  }

  // These configurations advise Relay on how to handle the Mutation's Payload
  // returned by the server. Here, we tell Relay to use the payload to
  // change the fields of a record it already has in the store. The
  // key-value pairs of ‘fieldIDs’ associate field names in the payload
  // with the ID of the record that we want updated.
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        person: this.props.person.id
      }
    }];
  }

  // This mutation has a hard dependency on the person's ID. We specify this
  // dependency declaratively here as a GraphQL query fragment. Relay will
  // use this fragment to ensure that the person's ID is available wherever
  // this mutation is used.
  static fragments = {
    person: () => Relay.QL`
      fragment on Person {
        id
        firstName
        lastName
        email
        language
      }
    `
  };

  // Implement this method to craft an optimistic response
  // having the same shape as the server response payload.
  // This optimistic response will be used to preemptively update the client cache
  // before the server returns, giving the impression that the mutation completed instantaneously.
  getOptimisticResponse() {
    return {
      person: {
        id: this.props.person.id,
        firstName: this.props.firstName,
        lastName: this.props.lastName,
        email: this.props.email,
        language: this.props.language
      }
    };
  }
}

/**
 * Exports.
 */
export default UpdatePersonMutation;
