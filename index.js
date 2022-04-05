const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');

const port = 4000
const app = express();
const dbUri = 'mongodb://localhost/authentication';

app.use(express.json());
app.use('/api/auth', authRoute);

mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
  console.log('Ready for connections');
});
const db = mongoose.connection;

db.on('error', (err) => { console.error(err); });
db.once('open', () => { console.log('DB started successfully') });

app.listen(port, () => { console.log(`Server started: ${port}`) });
