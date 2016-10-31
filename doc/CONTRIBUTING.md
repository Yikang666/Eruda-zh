# Contributing Guide

## Development Setup

[Node.js](https://nodejs.org/en/) is needed for the development of eruda.

After cloning the repo, run:

```bash
# install npm dependencies.
npm install
# copy jasmine lib from node_modules to test folder.
npm run cpTestLib
```

## Commonly used NPM scripts

```bash
# watch and auto re-build, webpack-dev-server is required.
npm run dev
# build eruda.js and eruda.min.js
npm run build
```

## Project Structure

- **dev**: development related files.
- **doc**: documents.
- **eustia**: eustia extended utilties.
- **script**: webpack configuration, and some other useful scripts.
- **src**: source code, written in es2015.
- **test**: contain pages for testing.
