import { TranscriptDetail, LogMsg, LogEntry } from '../types/voiceflow';

export function flattenTranscript(detail: TranscriptDetail): LogMsg[] {
  const tId = detail?.id;
  const logs = detail?.logs ?? [];
  
  return logs.map((l: LogEntry) => ({
    transcript_id: tId,
    ts: l?.timestamp ?? l?.ts ?? '',
    role: (l?.role ?? 'system') as 'user' | 'assistant' | 'system',
    text: l?.text ?? l?.payload?.text ?? '',
    meta: l,
  })).filter(m => m.text && m.text.trim().length > 0);
}

export function humanDuration(start?: string, end?: string): string {
  if (!start || !end) return 'in corso';
  
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  
  if (isNaN(startTime) || isNaN(endTime)) return 'durata sconosciuta';
  
  const ms = endTime - startTime;
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes}'${String(seconds).padStart(2, '0')}"`;
}

export function formatSessionLabel(transcript: any): string {
  const date = transcript.createdAt 
    ? new Date(transcript.createdAt).toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Data sconosciuta';
  
  const duration = humanDuration(transcript.createdAt, transcript.endedAt);
  
  return `Sessione: ${date} • durata ${duration}`;
}

export function deduplicateMessages(messages: LogMsg[]): LogMsg[] {
  const seen = new Set<string>();
  
  return messages.filter(msg => {
    const key = `${msg.transcript_id}-${msg.ts}-${msg.role}-${hashString(msg.text)}`;
    
    if (seen.has(key)) {
      return false;
    }
    
    seen.add(key);
    return true;
  });
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

export function isTranscriptActive(transcript: any): boolean {
  return !transcript.endedAt || transcript.endedAt === null;
}

export function sortMessagesByTimestamp(messages: LogMsg[]): LogMsg[] {
  return [...messages].sort((a, b) => {
    const timeA = new Date(a.ts).getTime();
    const timeB = new Date(b.ts).getTime();
    return timeA - timeB; // Oldest first
  });
}