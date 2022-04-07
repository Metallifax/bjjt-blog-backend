import server from './utils/server.js';
import connect from './utils/database.js';
import config from './config/default.js';
import logger from './utils/logger.js';

const app = server();

app.listen(config.port, async () => {
  logger.info(`Server started: ${config.port}`);

  await connect();
});
