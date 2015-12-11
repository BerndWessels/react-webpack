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

import task from './lib/task';

/**
 * Create/override database with fake data.
 */
function createPersonAndPosts() {
  return db.person.create({
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email()
    })
    .then(person => createPost(person, 0));
}

function createPost(person, index) {
  return person.createPost({
    title: `Sample ${index} by ${person.firstName}`,
    content: `Content ${index} for ${person.lastName}`
  });
}


export default task('create/override fake database', async () => {
  var viewer;
  await db.sequelize.sync({force: true})
    .then(createPersonAndPosts)
    .then(createPersonAndPosts)
    .then(createPersonAndPosts)
    .then(createPersonAndPosts)
    .then(createPersonAndPosts)
    .then(createPersonAndPosts)
    .then(createPersonAndPosts)
    .then(createPersonAndPosts)
    .then(createPersonAndPosts)
    .then(createPersonAndPosts)
    .then(()=> {
      return db.person.findOne({where: {id: 2}});
    })
    .then(person => {
      viewer = person;
      return createPost(viewer, 1)
    })
    .then(_ => createPost(viewer, 2))
    .then(_ => createPost(viewer, 3))
    .then(_ => createPost(viewer, 4))
    .then(_ => createPost(viewer, 5))
    .then(_ => createPost(viewer, 6))
    .then(_ => createPost(viewer, 7))
    .then(_ => createPost(viewer, 8))
    .then(_ => createPost(viewer, 9))
});
