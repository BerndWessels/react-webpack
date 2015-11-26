/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';
import { Schema } from '../data/schema';
import { graphql }  from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';

import task from './lib/task';

// Save JSON of full schema introspection for Babel Relay Plugin to use
export default task('schema', async () => {
  var result = await (graphql(Schema, introspectionQuery));
  if (result.errors) {
    console.error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    );
  } else {
    fs.writeFileSync(
      path.join(__dirname, '../data/schema.json'),
      JSON.stringify(result, null, 2)
    );
  }

  // Save user readable type system shorthand of schema
  fs.writeFileSync(
    path.join(__dirname, '../data/schema.graphql'),
    printSchema(Schema)
  );
});
