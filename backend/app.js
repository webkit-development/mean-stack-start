const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const config = require('./config/database');
const {router} = require("express/lib/application");

mongoose.connect(config.database);
mongoose.connection.on('connected', () => {
  console.log(`Connected to database: ${config.database}`);
});

mongoose.connection.on('error', (err) => {
  console.log(`There has been error connecting to the database: ${err}`);
});

const app = express();
const routes = require('./routes/routes');
app.set('trust proxy', 1);
app.use(session({
  secret: 'sld;jsdlkjsdlkjwlwj33l34l5k65j6lk7j7ljk',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', routes);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});


module.exports = app;
