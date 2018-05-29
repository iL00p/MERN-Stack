const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const appModules = require('./config/appConfig').modules;

const app = express();
const PORT = process.env.PORT || 5000;
const db = require('./config/keys').mongoURI;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(db).then(() => console.log('DB CONNECTED!')).catch(err => console.log('ERR::', err));

app.use(passport.initialize());

require('./config/passport')(passport);

appModules.forEach((module) => {
  const routerPath = `./modules/${module}/${module}.router`;
  const router = require(routerPath);

  app.use(`/api/${module}`, router);
});

app.listen(PORT, () => console.log(`======= Running on port ${PORT} =========`));
