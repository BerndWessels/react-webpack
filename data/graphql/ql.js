/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Import Babel helpers.
 */
import _extends from 'babel-runtime/helpers/extends';

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
  fromGlobalId,
  nodeDefinitions,
} from 'graphql-relay';

/**
 * We get the node interface and field from the Relay library.
 */
var defs = nodeDefinitions(
  // The first method defines the way we resolve an ID to its object.
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    var registeredType = registeredTypes.find(x => type === x.name);
    if (registeredType) return registeredType.getByID(id);
    else return null;
  },
  // The second defines the way we resolve an object to its GraphQL type.
  (obj) => {
    var registeredType = registeredTypes.find(x => obj instanceof x.dbType);
    if (registeredType) return registeredType.qlType;
    else return null;
  }
);

export const nodeInterface = defs.nodeInterface;
export const nodeField = defs.nodeField;

/**
 * Every type should register itself.
 */
var registeredTypes = [];

export function registerType(type) {
  registeredTypes.push(type);
}

/**
 * The common pagination info type used by all connections.
 */
export const paginationInfoType = new GraphQLObjectType({
  name: 'paginationInfo',
  description: 'Information about pagination in a connection.',
  fields: function fields() {
    return {
      hasNextPage: {
        type: new GraphQLNonNull(GraphQLBoolean),
        description: 'When paginating forwards, are there more items?'
      },
      hasPreviousPage: {
        type: new GraphQLNonNull(GraphQLBoolean),
        description: 'When paginating backwards, are there more items?'
      },
      startCursor: {
        type: GraphQLInt,
        description: 'When paginating backwards, the cursor to continue.'
      },
      endCursor: {
        type: GraphQLInt,
        description: 'When paginating forwards, the cursor to continue.'
      }
    };
  }
});

/**
 * Returns a GraphQLObjectType for a windowed pagination with the given name,
 * and whose nodes are of the specified type.
 */

export const paginationDefinitions = function (config) {
  var nodeType = config.nodeType;

  var name = config.name != null ? config.name : nodeType.name;
  var edgeFields = config.edgeFields || {};
  var connectionFields = config.connectionFields || {};
  var resolveNode = config.resolveNode;
  var resolveCursor = config.resolveCursor;
  var edgeType = new GraphQLObjectType({
    name: name + 'Edge',
    description: 'An edge in a connection.',
    fields: function fields() {
      return _extends({
        node: {
          type: nodeType,
          resolve: resolveNode,
          description: 'The item at the end of the edge'
        },
        cursor: {
          type: new GraphQLNonNull(GraphQLInt),
          resolve: resolveCursor,
          description: 'A cursor for use in pagination'
        }
      }, resolveMaybeThunk(edgeFields));
    }
  });

  var connectionType = new GraphQLObjectType({
    name: name + 'Connection',
    description: 'A connection to a list of items.',
    fields: function fields() {
      return _extends({
        pageInfo: {
          type: new GraphQLNonNull(paginationInfoType),
          description: 'Information to aid in pagination.'
        },
        edges: {
          type: new GraphQLList(edgeType),
          description: 'Information to aid in pagination.'
        }
      }, resolveMaybeThunk(connectionFields));
    }
  });

  return { edgeType: edgeType, connectionType: connectionType };
};

/**
 * Pagination connection input arguments.
 */
export const paginationArgs = {
  offset: {
    type: GraphQLInt
  },
  limit: {
    type: GraphQLInt
  }
};

/**
 * Given a slice (subset) of an array, returns a connection object for use in
 * GraphQL.
 *
 * This function is similar to `connectionFromArray`, but is intended for use
 * cases where you know the cardinality of the connection, consider it too large
 * to materialize the entire array, and instead wish pass in a slice of the
 * total result large enough to cover the range specified in `args`.
 */
export const paginationFromArraySlice = function (arraySlice, offset, limit, sliceStart, arrayLength) {
  // TODO: offset < sliceStart will crash!

  var sliceEnd = sliceStart + arraySlice.length;

  // If supplied slice is too large, trim it down before mapping over it.
  var slice = arraySlice.slice(Math.max(offset - sliceStart, 0), Math.min(limit, sliceEnd - offset));

  var edges = slice.map(function (value, index) {
    return {
      cursor: offset + index,
      node: value
    };
  });

  var firstEdge = edges[0];
  var lastEdge = edges[edges.length - 1];

  return {
    edges: edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: offset > limit,
      hasNextPage: offset < arrayLength - limit
    }
  };
};

/**
 * Helper functions.
 */
function resolveMaybeThunk(thingOrThunk) {
  return typeof thingOrThunk === 'function' ? thingOrThunk() : thingOrThunk;
}
