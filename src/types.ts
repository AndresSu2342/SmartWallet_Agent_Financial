export interface FinancialPayload {
  user_id: number;
  semantic_memory?: any;
  transactions_last_30_days?: any[];
  aggregates?: any;
  goals_summary?: any[];
  budgets_summary?: any[];
  [key: string]: any;
}

export interface EpisodicRecordParams {
  user_id: number | null;
  agent_name: string;
  event_type: string;
  input_payload: any;
  semantic_snapshot?: any;
  episodic_context?: any;
  output_payload: any;
  used_tone?: string | null;
}
