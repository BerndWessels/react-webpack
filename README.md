# Overview

This is a template you can fork and clone to develop React SPA Websites.

# Features
* Heavily commented webpack configuration with reasonable defaults.
* ES6, and ES7 support with babel.js.
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

## Scripts

* `npm start` - start development server, try it by opening `http://localhost:8080/`
* `npm run build` - generate a minified build to dist folder
* `npm run test` - run all tests
* `npm run test:live` - continuously run unit tests watching for changes
* `npm run schema:update` - update the Relay GraphQL schema
* `npm run schema:serve` - serve the Relay GraphQL data endpoint

See what each script does by looking at the `scripts` section in [package.json](./package.json).

# Contribution

You are very welcome to report issues and to contribute to the project.
