/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Import GraphQL types.
 */
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

/**
 * Import Relay helpers.
 */
import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

/**
 * Import GraphQL Types.
 */
import qlPerson from '../graphql/qlPerson';
import qlPost from '../graphql/qlPost';

/**
 * Import Database Entities.
 */
import db from '../database/db';

/**
 * Create the GraphQL Mutation.
 */
export default mutationWithClientMutationId({
  // Mutation name.
  name: 'DeletePost',
  // Fields supplied by the client.
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)}
  },
  // Mutated fields returned from the server.
  outputFields: {
    viewer: {
      type: qlPerson,
      // Parameters are payload from mutateAndGetPayload.
      resolve: ({viewer}) => {
        return viewer;
      }
    },
    deletedId: {
      type: GraphQLID,
      // Parameters are payload from mutateAndGetPayload.
      resolve: ({id}) => {
        return id;
      }
    }
  },
  // Take the input fields, process the mutation and return the output fields.
  mutateAndGetPayload: (inputFields, {rootValue}) => {
    // TODO: Process Authentication {"session":{"userId":1}}
    console.log(JSON.stringify(rootValue));
    // Convert the client id back to a database id.
    var localPostId = fromGlobalId(inputFields.id).id;
    // Find the post with the given id in the database.
    return db.post.findOne({where: {id: localPostId}}).then((dbPost)=> {
      // Delete the post.
      return dbPost.destroy().then(()=> {
        return {id: localPostId, viewer: {id: dbPost.personId}};
      });
    });
  }
});
