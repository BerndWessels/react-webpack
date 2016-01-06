# Current Version 0.2.3

# Overview

This is a template you can fork and clone to develop data driven React/Relay SPA Websites using a single GraphQL endpoint.

It also shows how to integrate access to databases like mysql or postgres.

# Babel 6

Starting with version 0.2.0 we moved on to Babel 6.

If for any reason you have to stick to Babel 5 then use 0.1.x versions of this repo.

Some of the modules might still be a bit wonky since Babel 6 support is just slowly making it into the eco-system.

    "babel-plugin-react-transform": "^2.0.0",
    "babel-preset-es2015": "^6.0.0",
    "babel-preset-react": "^6.0.0",
    "babel-preset-stage-0": "^6.0.0",

Make sure you get the latest versions. Otherwise you might run into bugs that have already been fixed.

# Todo

Remove `"webpack-sources": "^0.1.0"` from `package.json` as soon as [this issue](https://github.com/webpack/extract-text-webpack-plugin/issues/143) is resolved.

# Features
* React
* Relay
* GraphQL
* MySQL
* Webpack
* React Bootstrap
* Heavily commented webpack configuration with reasonable defaults.
* Latest JSX, ES6, and ES7 support with babel 6.
* Source maps included in all builds.
* Development server with live reload.
* Production builds with cache busting and asset minification.
* Testing environment using karma to run tests and jasmine as the framework.
* Code coverage when tests are run.
* No gulp and no grunt, just npm run-scripts.

# Getting Started

* Windows Users might want to install [Git Credential](https://chocolatey.org/packages/git-credential-winstore) Store.
  This will prevent you from getting stuck during npm installs that require your username and password.
* Install [NodeJS](https://nodejs.org/)
* Now make sure the web-site folder is the current folder.
* Install the node module dependencies: <code>npm install</code>
* In case there are problems while installing dependencies you can clean the repository caches: <code>npm cache clear</code>
* Sometimes company proxies can cause issues with GIT. A possible fix could be: <code>git config --global url."https://".insteadOf git://</code>

# Develop

First create the fake database. To do so update the `data/database/db.js` with the correct connection details to your database.

    /**
     * Create the database connection.
     */
    var sequelize = new Sequelize('schema', 'user', 'password', {
      host: '192.168.101.92',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    });

Then create/override the database with fake data `npm run database:fake`

Now update/create the graphql schema `npm run schema:update`

Make sure the ports used are all available and run the graphql server `npm run schema:serve`

Now in another console you can start developing with `npm start`

That should automatically open a browser window on port 3000 and you are ready to go.

# Build Production

To build the production version of the client you first update/create the graphql schema `npm run schema:update`

Then run `npm run build`

This will create a `dist` folder with all the static production files and resources.

You can copy the `dist` content now to your production environment.

If you want to run the production version locally to make sure it works, you can run `npm run build:serve`.
This will serve the `dist` folder on port `8080`. Just make sure you serve the schema as well.

## Scripts

* `npm start` - start development server, try it by opening `http://localhost:8080/` or with browser sync `http://localhost:3000/`
* `npm run build` - generate a minified build to dist folder
* `npm run build:serve` - serve the minified build locally on port 8080
* `npm run test` - run all tests
* `npm run test:live` - continuously run unit tests watching for changes
* `npm run database:fake` - create/override the database with fake data
* `npm run schema:update` - update the Relay GraphQL schema
* `npm run schema:serve` - serve the Relay GraphQL data endpoint

See what each script does by looking at the `scripts` section in [package.json](./package.json).

# Contribution

You are very welcome to report issues and to contribute to the project.
