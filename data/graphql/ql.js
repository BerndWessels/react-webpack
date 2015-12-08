/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Import Relay helpers.
 */
import {
  fromGlobalId,
  nodeDefinitions,
} from 'graphql-relay';

/**
 * Every type should register itself.
 */
var registeredTypes = [];

/**
 * We get the node interface and field from the Relay library.
 */
var defs = nodeDefinitions(
  // The first method defines the way we resolve an ID to its object.
  (globalId) => {
    console.log('---------------------------------------------------------------' + globalId);
    var {type, id} = fromGlobalId(globalId);
    var registeredType = registeredTypes.find(x => x.name === type);
    if (registeredType) return registeredType.getByID(id);
    else return null;
  },
  // The second defines the way we resolve an object to its GraphQL type.
  (obj) => {
    console.log('--------------------------------------------------------------+' + JSON.stringify(obj));
    var registeredType = registeredTypes.find(x => obj instanceof x.dbType);
    console.log('-------------------------------------------------------------++' + JSON.stringify(registeredType));
    if (registeredType) return registeredType.qlType;
    else return null;
  }
);

/**
 * Exports.
 */
export function registerType(type) {
  registeredTypes.push(type);
}
export const nodeInterface = defs.nodeInterface;
export const nodeField = defs.nodeField;
