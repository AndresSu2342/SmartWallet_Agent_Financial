# Agente Financiero (Node.js)

Este proyecto contiene un agente que consume una cola SQS con contexto financiero, llama a la API de OpenAI para realizar un análisis y guarda la salida en la tabla `episodic_memory_financial` en Postgres.

Instalación:

```pwsh
cd C:\Users\maria.torres-m\Downloads\agente-financiero
npm install
```

Variables de entorno (añádelas a `.env`):

- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SQS_INPUT_QUEUE_URL`
- `OPENAI_API_KEY`
- `EPISODIC_DB_HOST` `EPISODIC_DB_PORT` `EPISODIC_DB_NAME` `EPISODIC_DB_USER` `EPISODIC_DB_PASSWORD`

Ejecución (TypeScript):

Modo desarrollo (usa `ts-node`):

```pwsh
npm run dev
```

Build y ejecución en producción:

```pwsh
npm run build
npm start
```

Esquema de la tabla (ejemplo):

```sql
CREATE TABLE episodic_memory_financial (
  id SERIAL PRIMARY KEY,
  user_id bigint,
  agent_name text,
  event_type text,
  input_payload jsonb,
  semantic_snapshot jsonb,
  episodic_context jsonb,
  output_payload jsonb,
  used_tone text,
  created_at timestamptz default now()
);
```

Notas de buenas prácticas:
- El agente expone un consumidor simple con manejo básico de errores.
- El output de OpenAI se guarda tal cual como JSON en la columna `output_payload`.
- Ajusta `POLL_INTERVAL_MS` y `MAX_MESSAGES` en `.env` según el volumen de tráfico.
