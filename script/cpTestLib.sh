#!/usr/bin/env bash

mkdir -p test/lib
cp node_modules/jasmine-core/lib/jasmine-core/{jasmine.css,jasmine.js,jasmine-html.js,boot.js} test/lib/
cp node_modules/jasmine-jquery/lib/jasmine-jquery.js test/lib/
cp node_modules/jquery/dist/jquery.js test/lib/
