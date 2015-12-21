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
  connectionFromArraySlice,
  cursorToOffset,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

/**
 * Import Database Access.
 */
import db from '../database/db';

/**
 * Import GraphQL Types.
 */
import {nodeInterface, nodeField, registerType} from './ql';
import qlPost from './qlPost';

/**
 * Create the associations.
 */
var {connectionType: postsConnection} = connectionDefinitions({
  name: 'post',
  nodeType: qlPost,
  connectionFields: () => ({
    totalCount: {
      type: GraphQLInt,
      resolve: (connection) => connection.totalCount,
      description: `A count of the total number of objects in this connection, ignoring pagination.
This allows a client to fetch the first five objects by passing "5" as the
argument to "first", then fetch the total count so it could display "5 of 83",
for example.`
    }
  })
});

/**
 * Create the GraphQL Type.
 */
// Type name and global id.
const typeName = 'Person';

// Type creation.
var qlPerson = new GraphQLObjectType({
  name: typeName,
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField(typeName),
    firstName: {
      type: GraphQLString
      /**
       * No need to provide a resolve function for simple properties
       * which map directly from the source object to the target.
       *
       * resolve(dbPerson) {
       *   return dbPerson.firstName;
       * }
       */
    },
    lastName: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    posts: {
      // This serves the 'person to post' connection with support for paging.
      type: postsConnection,
      // We can extend the connection args with our own if we want to.
      args: {...{}, ...connectionArgs},
      // Resolve the requested page of posts.
      resolve(dbPerson, args) {
        // Calculate the database offset to the requested page.
        var offset = args.after ? cursorToOffset(args.after) + 1 : args.before ? Math.max(cursorToOffset(args.before) - args.last, 0) : 0;
        // Query the database.
        return db.post.findAndCountAll({
            where: {personId: dbPerson.id},
            offset: offset,
            limit: args.first ? args.first : args.last ? args.last : undefined
          })
          .then(function (result) {
            // Combine the returned connection result with the extra totalCount property.
            return {
              ...connectionFromArraySlice(result.rows, args, {
                sliceStart: offset,
                arrayLength: result.count
              }),
              totalCount: result.count
            }
          });
      }
    }
  }),
  interfaces: [nodeInterface]
});

// Type registration.
registerType({
  name: typeName,
  getByID: (id)=>db.person.findOne({where: {id: id}}),
  dbType: db.person.Instance,
  qlType: qlPerson
});

// Type export.
export default qlPerson;
