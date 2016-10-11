const path = require('path');
const express = require('express');

const app = express();
const PORT = 80;
const appPath = path.join(__dirname, 'dist');

app.use(express.static(appPath));

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}!`);
});
