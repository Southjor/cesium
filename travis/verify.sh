#!/bin/bash
set -ev
if [ $TRAVIS_BRANCH != "cesium.com" ]; then
  # Various Node.js smoke-screen tests
  node -e "const Cesium = require('./');"
  NODE_ENV=development node Specs/test.cjs
  NODE_ENV=production node Specs/test.cjs
  node Specs/test.mjs

  npm --silent run cloc
fi