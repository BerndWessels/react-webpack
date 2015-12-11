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
import db from '../database/db';

/**
 * Import GraphQL Types.
 */
import {nodeInterface, nodeField, registerType} from './ql';
import qlPerson from './qlPerson';

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
