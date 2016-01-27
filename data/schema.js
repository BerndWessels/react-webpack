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
 * Import Database Entities.
 */
import db from './database/db';

/**
 * Import GraphQL Types.
 */
import {nodeInterface, nodeField} from './graphql/ql';
import qlPerson from './graphql/qlPerson';
import qlPost from './graphql/qlPost';

/**
 * Import GraphQL Mutations.
 */
import updatePersonMutation from './graphql/mtUpdatePerson';
import deletePostMutation from './graphql/mtDeletePost';

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: qlPerson,
      resolve: (_, args, {rootValue: {session}}) => {
        return db.person.findOne({where: {id: 2}});
      }
    }
/*
    ,
    people: {
      type: new GraphQLList(qlPerson),
      resolve: (_, args, {rootValue: {session}}) => {
        return db.person.findAll({where: args});
      }
    },
    posts: {
      type: new GraphQLList(qlPost),
      resolve: (_, args, {rootValue: {session}}) => {
        return db.post.findAll({where: args});
      }
    }
*/
  })
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    updatePerson: updatePersonMutation,
    deletePost: deletePostMutation
  }
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
