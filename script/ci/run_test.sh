#!/usr/bin/env sh
phantomjs test/vendor/runner.js "http://localhost/test/index.html"
mocha test/nodeIntegration.js
