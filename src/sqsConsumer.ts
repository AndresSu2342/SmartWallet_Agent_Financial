import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import config from './config';
import pino from 'pino';
import processor from './processor';

const logger = pino({ level: config.logLevel });
const client = new SQSClient({ region: config.awsRegion });

async function pollOnce() {
  const params = {
    QueueUrl: config.sqsInputQueueUrl,
    MaxNumberOfMessages: config.maxMessages,
    WaitTimeSeconds: 10,
    VisibilityTimeout: 60
  };

  try {
    const cmd = new ReceiveMessageCommand(params);
    const res = await client.send(cmd);
    const messages = res.Messages || [];
    for (const m of messages) {
      try {
        logger.info({ messageId: m.MessageId }, 'Received message');
        const body = JSON.parse(m.Body as string);
        await processor.processPayload(body);

        const del = new DeleteMessageCommand({ QueueUrl: config.sqsInputQueueUrl, ReceiptHandle: m.ReceiptHandle });
        await client.send(del);
        logger.info({ messageId: m.MessageId }, 'Deleted message');
      } catch (err: any) {
        logger.error({ err: err.message || err }, 'Message processing error — message will remain in queue');
      }
    }
  } catch (err: any) {
    logger.error({ err: err.message || err }, 'SQS receive failed');
  }
}

export function startPolling() {
  logger.info('Starting SQS poller');
  setInterval(() => {
    pollOnce().catch((err) => logger.error({ err }, 'Poll error'));
  }, config.pollIntervalMs);
}

export default { startPolling };
