import pino from 'pino';
import config from './config';
import { startPolling } from './sqsConsumer';

const logger = pino({ level: config.logLevel });

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Rejection');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught Exception');
  process.exit(1);
});

logger.info('Agent starting (TypeScript)');
startPolling();
