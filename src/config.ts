import dotenv from 'dotenv';
dotenv.config();

export const config = {
  awsRegion: process.env.AWS_REGION,
  sqsInputQueueUrl: process.env.SQS_INPUT_QUEUE_URL,
  sqsOutputQueueUrl: process.env.SQS_OUTPUT_QUEUE_URL,
  pollIntervalMs: parseInt(process.env.POLL_INTERVAL_MS || '5000', 10),
  maxMessages: parseInt(process.env.MAX_MESSAGES || '1', 10),
  openaiApiKey: process.env.OPENAI_API_KEY,
  logLevel: process.env.LOG_LEVEL || 'info',
  episodicDb: {
    host: process.env.EPISODIC_DB_HOST,
    port: parseInt(process.env.EPISODIC_DB_PORT || '5432', 10),
    database: process.env.EPISODIC_DB_NAME,
    user: process.env.EPISODIC_DB_USER,
    password: process.env.EPISODIC_DB_PASSWORD
  }
} as const;

export default config;
