import express from 'express';
import authRoute from '../routes/auth.route.js';
import userRoute from '../routes/user.route.js';

const server = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoute);
  app.use('/api/user', userRoute);

  return app;
};

export default server;
