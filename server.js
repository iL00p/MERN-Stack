const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();
const PORT = process.env.PORT || 5000;
const db = require('./config/keys').mongoURI;

mongoose
  .connect(db)
  .then( () => console.log('DB CONNECTED!') )
  .catch( err => console.log("ERR::",err) );

app.get('/',(req,res) => res.send('Hey!'));

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(PORT,() => console.log(`======= Running on port ${PORT} =========`) );