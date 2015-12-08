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
var {connectionType: postsConnection} = connectionDefinitions({name: 'post', nodeType: qlPost});

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
      type: GraphQLString,
      resolve(dbPerson) {
        return dbPerson.firstName;
      }
    },
    lastName: {
      type: GraphQLString,
      resolve(dbPerson) {
        return dbPerson.lastName;
      }
    },
    email: {
      type: GraphQLString,
      resolve(dbPerson) {
        return dbPerson.email;
      }
    },
    posts: {
      type: postsConnection,
      args: connectionArgs,
      resolve(dbPerson, args) {
        return dbPerson.getPosts().then(function (data) {
          return connectionFromArray(data, args);
        });
      }
    }
  }),
  interfaces: [nodeInterface]
});

// Type registration.
registerType({name: typeName, getByID: (id)=>db.person.findOne({where: {id: id}}), dbType: db.person.Instance, qlType: qlPerson});

// Type export.
export default qlPerson;
