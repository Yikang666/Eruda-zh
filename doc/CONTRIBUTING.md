# Contributing Guide

## Development Setup

[Node.js](https://nodejs.org/en/) is needed for the development of eruda.

After cloning the repo, run:

```bash
# install npm dependencies.
npm install
# copy jasmine lib from node_modules to test folder.
npm run setup
```

## Commonly used NPM scripts

```bash
# watch and auto re-build.
npm run dev
# build eruda.js and eruda.min.js
npm run build
# lint, build and test.
npm run ci
# check test coverage.
npm run cov
```

## Project Structure

- **doc**: documents.
- **eustia**: eustia extended utilties.
- **script**: webpack configuration, and some other useful scripts.
- **src**: source code, written in es2015.
- **test**: contain pages for testing.
