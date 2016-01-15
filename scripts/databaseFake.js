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
import q from 'q';

/**
 * Import Database Access.
 */
import db from '../data/database/db';

import task from './lib/task';

/**
 * Create/override database with fake data.
 */
export default task('create/override fake database', async () => {
  await db.sequelize.sync({force: true})
    .then(() => {
      // Create 10 persons.
      return q.all(_.times(10, () => {
        return createPerson();
      }));
    });
});

function createPerson() {
  return db.person.create({
      firstName: Faker.name.firstName(),
      lastName: Faker.name.lastName(),
      email: Faker.internet.email(),
      language: 'en'
    })
    .then(person => {
      // Create 10 posts for each person.
      return q.all(_.times(10, (n) => {
        return createPost(person, n);
      }));
    });
}

function createPost(person, index) {
  return person.createPost({
      title: `Post ${index} by ${person.firstName}`,
      content: `Post ${index} for ${person.lastName}`
    })
    .then(post => {
      // Create 10 comments for each post.
      return q.all(_.times(10, (n) => {
        return createComment(post, n);
      }));
    });
}

function createComment(post, index) {
  return post.createComment({
    content: `Comment ${index} for [${post.title}]`
  });
}
