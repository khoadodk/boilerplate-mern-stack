const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(5000);
