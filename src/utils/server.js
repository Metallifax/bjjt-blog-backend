import express from 'express';
import cors from 'cors';
import authRoute from '../routes/auth.route.js';
import userRoute from '../routes/user.route.js';

const server = () => {
  try {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api/auth', authRoute);
    app.use('/api/user', userRoute);

    return app;
  } catch (err) {
    logger.error(`Server error: ${err}`);
  }
};

export default server;
