import mongoose from 'mongoose';
import config from '../config/default.js';
import logger from './logger.js';

const connect = async () => {
  try {
    await mongoose.connect(
      config.get('dbUri'),
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => {
        logger.info('DB ready for connections');
      },
    );
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

export default connect;
