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
  name: 'UpdatePerson',
  // Fields supplied by the client.
  inputFields: {
    id: {type: new GraphQLNonNull(GraphQLID)},
    email: {type: GraphQLString},
    language: {type: GraphQLString}
  },
  // Mutated fields returned from the server.
  outputFields: {
    person: {
      type: qlPerson,
      // Parameters are payload from mutateAndGetPayload followed by outputFields.
      resolve: (dbPerson, id, email, language) => {
        return dbPerson;
      }
    }
  },
  // Take the input fields, process the mutation and return the output fields.
  mutateAndGetPayload: (inputFields, {rootValue}) => {
    // TODO: Process Authentication {"session":{"userId":1}}
    console.log(JSON.stringify(rootValue));
    // Convert the client id back to a database id.
    var localPersonId = fromGlobalId(inputFields.id).id;
    // Find the person with the given id in the database.
    return db.person.findOne({where: {id: localPersonId}}).then((dbPerson)=> {
      // Mutate the person.
      Object.assign(dbPerson, inputFields, {id: localPersonId});
      // Save it back to the database.
      return dbPerson.save().then(()=> {
        // Return the mutated person as an output field.
        return dbPerson;
      });
    });
  }
});
