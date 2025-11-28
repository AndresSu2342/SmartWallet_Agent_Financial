import OpenAI from 'openai';
import config from './config';
import { FinancialPayload } from './types';

const client = new OpenAI({ apiKey: config.openaiApiKey });

export async function analyzeFinancial(payload: FinancialPayload): Promise<string> {
  const systemPrompt = `Eres un asistente financiero que analiza datos transaccionales y de contexto. Recibirás un objeto JSON con información del usuario, memoria semántica, transacciones, agregados, metas y presupuestos. Devuelve únicamente un JSON con el esquema requerido, sin texto adicional.`;

  const userMessage = `Input JSON:\n${JSON.stringify(payload)}`;

  const resp = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.2,
    max_tokens: 1200
  });

  const text = resp.choices && resp.choices[0] && resp.choices[0].message && resp.choices[0].message.content;
  if (!text) throw new Error('Empty response from OpenAI');
  return text;
}

export default { analyzeFinancial };
