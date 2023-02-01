/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

'use strict';

const express = require('express');

const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', { backend_url: process.env.BACKEND_URL });
});

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);
