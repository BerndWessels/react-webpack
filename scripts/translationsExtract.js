import * as fs from 'fs';
import path from 'path';
import {sync as globSync} from 'glob';
import {sync as mkdirpSync} from 'mkdirp';
import rimraf from 'rimraf';
import webpack from 'webpack';
import config from '../webpack.translate';
import task from './lib/task';

function extract() {
  // The i18n build directory.
  const I18N_DIR = path.join(__dirname, '../build/i18n');

  // Aggregates the default messages that were extracted from the example app's
  // React components via the React Intl Babel plugin. An error will be thrown if
  // there are messages in different components that use the same `id`. The result
  // is a flat collection of `id: message` pairs for the app's default locale.
  let defaultMessages = globSync(I18N_DIR + '/src/**/*.json')
    .map((filename) => fs.readFileSync(filename, 'utf8'))
    .map((file) => JSON.parse(file))
    .reduce((collection, descriptors) => {
      descriptors.forEach(({id, defaultMessage}) => {
        if (collection.hasOwnProperty(id)) {
          throw new Error(`Duplicate message id: ${id}`);
        }

        collection[id] = defaultMessage;
      });

      return collection;
    }, {});

  return defaultMessages;
  // Create the i18n output file.
  // This file has to be merged with the already existing translations.
  // The merged translations have to be updated with the new missing translations.
  // fs.writeFileSync(I18N_DIR + '/i18n.json', JSON.stringify(defaultMessages, null, 2));
}

function merge(defaultMessages) {
  // The folder with the already translated files.
  const TRANSLATED_DIR = path.join(__dirname, '../public/assets/translations');

  // Merge existing translations with extracted default messages.
  globSync(TRANSLATED_DIR + '/**/*.json')
    .map((filename) => {
      var file = fs.readFileSync(filename, 'utf8');
      var translated = JSON.parse(file);
      fs.writeFileSync(filename, JSON.stringify(Object.assign({}, defaultMessages, translated), null, 2));
    });
}

// Save JSON of full schema introspection for Babel Relay Plugin to use
export default task('translations:export', async () => {

  var callback = function (err, stats) {
    if (err) {
      console.log(err.toString());
    } else {
      merge(extract());
      //console.log(stats.toString({colors: true}));
      rimraf(path.join(__dirname, '../build'), (err)=> {
        if (err) {
          console.log(err);
        }
      });
    }
  };

  webpack(config, callback);
});
