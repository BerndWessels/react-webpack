/**
 * Manapaho (https://github.com/manapaho/)
 *
 * Copyright © 2015 Manapaho. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * Import file system access.
 */
import fs from 'fs';
import path from 'path';

/**
 * Import database access.
 */
import Sequelize from 'sequelize';

    /**
     * Create the database connection.
     */
    var sequelize = new Sequelize('manapaho', 'root', 'abcDEF123', {
      host: '192.168.101.44',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    });

/**
 * Create the database access.
 */
var db = {};

// Import all models.
fs.readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "db.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

// Process all models.
Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

// Configure the database access.
db.sequelize = sequelize;
db.Sequelize = Sequelize;

/**
 * Exports.
 */
export default db;
