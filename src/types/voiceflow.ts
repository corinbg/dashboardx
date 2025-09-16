export interface TranscriptIndex {
  id: string;
  createdAt: string;
  endedAt?: string;
  expiresAt?: string;
  sessionID?: string;
}

export interface TranscriptDetail {
  id: string;
  createdAt: string;
  endedAt?: string;
  sessionID?: string;
  logs?: LogEntry[];
  [key: string]: any;
}

export interface LogEntry {
  timestamp?: string;
  ts?: string;
  role?: 'user' | 'assistant' | 'system';
  text?: string;
  payload?: {
    text?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface LogMsg {
  transcript_id: string;
  ts: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  meta?: any;
}

export interface TranscriptListResponse {
  transcripts: TranscriptIndex[];
  total?: number;
}

export interface SessionSeparator {
  id: string;
  label: string;
  type: 'separator';
}