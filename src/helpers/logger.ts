import { getLogger } from 'log4js';
const logger = getLogger();
logger.level = process.env.APP_LOG_LEVEL || 'debug';

export default logger;
