import express from 'express';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';

const port = 4000
const app = express();
const dbUri = 'mongodb://localhost/blog-backend';

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
  console.log('Ready for connections');
});
const db = mongoose.connection;

db.on('error', (err) => { console.error(err); });
db.once('open', () => { console.log('DB started successfully') });

app.listen(port, () => { console.log(`Server started: ${port}`) });
