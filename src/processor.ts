import pino from 'pino';
import openai from './openaiClient';
import * as db from './db';
import { FinancialPayload } from './types';

const logger = pino();

export async function processPayload(payload: FinancialPayload) {
  const userId = payload.user_id || null;
  const agentName = 'financial-insight-agent';
  const eventType = 'analysis';
  try {
    logger.info({ userId }, 'Starting analysis with OpenAI');
    const aiText = await openai.analyzeFinancial(payload);

    let aiJson: any = null;
    try {
      aiJson = JSON.parse(aiText);
    } catch (err) {
      const m = aiText.match(/\{[\s\S]*\}$/m);
      if (m) aiJson = JSON.parse(m[0]);
      else throw err;
    }

    const recordId = await db.saveEpisodicMemory({
      user_id: userId,
      agent_name: agentName,
      event_type: eventType,
      input_payload: payload,
      semantic_snapshot: payload.semantic_memory || null,
      episodic_context: payload.aggregates || null,
      output_payload: aiJson,
      used_tone: 'neutral'
    });

    logger.info({ recordId, userId }, 'Saved episodic memory');
    return aiJson;
  } catch (err: any) {
    logger.error({ err: err.message || err }, 'Processing failed');
    throw err;
  }
}

export default { processPayload };
