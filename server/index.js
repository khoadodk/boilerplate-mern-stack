const express = require('express');
require('./config/db')();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const userRoutes = require('./routes/users');

//----------Middlewares-------- ORDER is important
//Parse JSON into object, similar to body-parser
app.use(express.json({ extended: true }));
app.use(cors());
//store token in cookie
app.use(cookieParser());
//Route
app.use('/api/users', userRoutes);

//heroku production environment setup
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is starting at port ${PORT}`));
