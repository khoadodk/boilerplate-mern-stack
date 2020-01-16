const express = require('express');
require('./config/db')();
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const authRoutes = require('./routes/auth');

//----------Middlewares-------- ORDER is important
//Parse JSON into object, similar to body-parser
app.use(express.json({ extended: true }));
app.use(cors());
//morgan will help to debug endpoint in the console.log
app.use(morgan('dev'));
//Routes
app.use('/api', authRoutes);

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
