const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const appModules = require('./config/appConfig').modules;

const app = express();
const PORT = process.env.PORT || 5000;
const db = require('./config/keys').mongoURI;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(db).then(() => console.log('DB CONNECTED!')).catch(err => console.log("ERR::", err));

app.get('/', (req, res) => res.send('Hey!'));

appModules.forEach( module => {
  const path = `./modules/${module}/${module}.router`;
  const router = require( path );
  
  app.use( `/api/${module}`, router);
});

app.listen(PORT, () => console.log(`======= Running on port ${PORT} =========`));