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
import qlPost from './qlPost';

/**
 * Import Database Entities.
 */
import db from '../database/db';

/**
 * Create the GraphQL Type.
 */
// Type name and global id.
const typeName = 'Comment';

// Type creation.
var qlComment = new GraphQLObjectType({
  name: typeName,
  description: 'A comment to a post a person posted',
  fields: () => ({
    id: globalIdField(typeName),
    content: {
      type: GraphQLString,
      resolve(dbComment) {
        return dbComment.content;
      }
    },
    post: {
      type: qlPost,
      resolve(dbComment){
        return dbComment.getPost();
      }
    }
  }),
  interfaces: [nodeInterface]
});

// Type registration.
registerType({
  name: typeName,
  getByID: (id)=>db.comment.findOne({where: {id: id}}),
  dbType: db.comment.Instance,
  qlType: qlComment
});

// Type export.
export default qlComment;
