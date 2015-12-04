/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Import data creation helpers.
 */
import _ from 'lodash';
import Faker from 'faker';

/**
 * Import Database Access.
 */
import db from '../data/database/db';

/**
 * Create/override database with fake data.
 */
db.sequelize.sync({force: true}).then(()=> {
  _.times(10, ()=> {
    return db.person.create({
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email()
    }).then(person => {
      return person.createPost({
        title: `Sample by ${person.firstName}`,
        content: `Content for ${person.lastName}`
      });
    })
  });
});
