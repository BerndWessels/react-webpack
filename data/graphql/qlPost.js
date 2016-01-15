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
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

/**
 * Import GraphQL helpers.
 */
import {
  nodeInterface,
  nodeField,
  registerType
} from './ql';

/**
 * Import GraphQL Types.
 */
import qlPerson from './qlPerson';
import qlComment from './qlComment';

/**
 * Import Database Entities.
 */
import db from '../database/db';

/**
 * Create the associations.
 */
var {connectionType: commentsConnection} = connectionDefinitions({
  name: 'comment',
  nodeType: qlComment,
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
const typeName = 'Post';

// Type creation.
var qlPost = new GraphQLObjectType({
  name: typeName,
  description: 'A post a person posted',
  fields: () => ({
    id: globalIdField(typeName),
    title: {
      type: GraphQLString,
      resolve(dbPost) {
        return dbPost.title;
      }
    },
    content: {
      type: GraphQLString,
      resolve(dbPost) {
        return dbPost.content;
      }
    },
    person: {
      type: qlPerson,
      resolve(dbPost){
        return dbPost.getPerson();
      }
    },
    comments: {
      // This serves the 'post to comment' connection with support for paging.
      type: commentsConnection,
      // We can extend the connection args with our own if we want to.
      args: {...{}, ...connectionArgs},
      // Resolve the requested page of comments.
      resolve(dbPost, args) {
        // Calculate the database offset to the requested page.
        var offset = args.after ? cursorToOffset(args.after) + 1 : args.before ? Math.max(cursorToOffset(args.before) - args.last, 0) : 0;
        // Query the database.
        return db.comment.findAndCountAll({
            where: {postId: dbPost.id},
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
  getByID: (id)=>db.post.findOne({where: {id: id}}),
  dbType: db.post.Instance,
  qlType: qlPost
});

// Type export.
export default qlPost;
