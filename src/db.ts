import { Pool } from 'pg';
import config from './config';
import { EpisodicRecordParams } from './types';

const pool = new Pool({
  host: config.episodicDb.host,
  port: config.episodicDb.port,
  database: config.episodicDb.database,
  user: config.episodicDb.user,
  password: config.episodicDb.password,
  max: 5
});

export async function saveEpisodicMemory(params: EpisodicRecordParams): Promise<number> {
  const client = await pool.connect();
  try {
    const query = `INSERT INTO episodic_memory_financial (user_id, agent_name, event_type, input_payload, semantic_snapshot, episodic_context, output_payload, used_tone, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW()) RETURNING id`;
    const values = [
      params.user_id,
      params.agent_name,
      params.event_type,
      JSON.stringify(params.input_payload),
      JSON.stringify(params.semantic_snapshot),
      JSON.stringify(params.episodic_context),
      JSON.stringify(params.output_payload),
      params.used_tone || null
    ];
    const res = await client.query(query, values);
    return res.rows[0].id;
  } finally {
    client.release();
  }
}

export { pool };
