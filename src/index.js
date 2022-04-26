import server from './utils/server.js';
import connect from './utils/database.js';
import config from './config/default.js';
import logger from './utils/logger.js';

const port = config.get('port');
const app = server();

app.listen(port, async () => {
  logger.info(`Server started: ${port}`);

  await connect();
});
