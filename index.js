#!/usr/bin/env node
const path = require('path');
const express = require('express');
const controller = require('./controller.js');

const app = express();
const PORT = 80;
const appPath = path.join(__dirname, 'dist');

app.use(express.static(appPath));

let releasePower;
// Press
app.post('/power', (req, res) => {
  releasePower = controller.pressPower();
  res.status(200).end();
});

// Release
app.delete('/power', (req, res) => {
  if (releasePower) {
    releasePower();
    releasePower = undefined;
    res.status(200).end();
  }
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}!`);
});
