import React, { useState } from 'react';
import { Search, MessageCircle, Clock, Calendar, AlertCircle, Loader } from 'lucide-react';

// Costanti
const SUPABASE_FN_BASE = "https://adeknvjvfyjbwnohmztt.supabase.co/functions/v1";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZWtudmp2ZnlqYndub2htenR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDA1MzcsImV4cCI6MjA2MzgxNjUzN30.4l98On7Eht8GeyxXHTrXQG_OqysffrmLAjZ1ZGfLjO8";

const commonHeaders = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${SUPABASE_ANON}`,
  "apikey": SUPABASE_ANON,
};

// Tipi
interface TranscriptIndex {
  id: string;
  sessionID?: string;
  createdAt?: string;
  endedAt?: string | null;
  expiresAt?: string;
}

interface TranscriptDetailResponse {
  meta: {
    createdAt?: string | null;
    endedAt?: string | null;
    durationSec?: number | null;
  };
  transcript: any;
}

interface MessageNormalized {
  transcriptId: string;
  ts: string;
  role: string;
  text: string;
  key: string;
}

// Helper functions
function formatDateTime(iso?: string | null): string {
  if (!iso) return "Data sconosciuta";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Data non valida";
  return d.toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDuration(sec?: number | null): string {
  if (!sec && sec !== 0) return "durata sconosciuta";
  const s = Math.floor(sec);
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  const hh = Math.floor(mm / 60);
  const min = mm % 60;
  
  if (hh > 0) return `${hh}h ${min}m ${ss}s`;
  if (min > 0) return `${min}'${String(ss).padStart(2, '0')}"`;
  return `${ss}s`;
}

function hashText(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h << 5) - h + text.charCodeAt(i);
    h |= 0;
  }
  return h.toString(16);
}

function normalize(transcriptId: string, transcript: any): MessageNormalized[] {
  console.log(`[VFDBG] === NORMALIZE START for transcript ${transcriptId} ===`);
  console.log(`[VFDBG] Raw transcript object:`, transcript);
  
  // Try multiple paths to find logs
  let logs: any[] = [];
  
  if (transcript?.logs && Array.isArray(transcript.logs)) {
    logs = transcript.logs;
    console.log(`[VFDBG] Found logs at transcript.logs: ${logs.length} items`);
  } else if (transcript?.transcript?.logs && Array.isArray(transcript.transcript.logs)) {
    logs = transcript.transcript.logs;
    console.log(`[VFDBG] Found logs at transcript.transcript.logs: ${logs.length} items`);
  } else if (transcript?.data?.logs && Array.isArray(transcript.data.logs)) {
    logs = transcript.data.logs;
    console.log(`[VFDBG] Found logs at transcript.data.logs: ${logs.length} items`);
  } else if (transcript?.payload?.logs && Array.isArray(transcript.payload.logs)) {
    logs = transcript.payload.logs;
    console.log(`[VFDBG] Found logs at transcript.payload.logs: ${logs.length} items`);
  } else if (Array.isArray(transcript)) {
    logs = transcript;
    console.log(`[VFDBG] Transcript is array itself: ${logs.length} items`);
  } else {
    console.log(`[VFDBG] No logs found in transcript, trying to extract from all keys...`);
    
    // Try to find logs in any property that contains an array
    for (const [key, value] of Object.entries(transcript || {})) {
      if (Array.isArray(value) && value.length > 0) {
        console.log(`[VFDBG] Found potential logs array in property "${key}": ${value.length} items`);
        logs = value;
        break;
      }
    }
  }
  
  console.log(`[VFDBG] Final logs array: ${logs.length} items`);
  
  if (logs.length > 0) {
    console.log(`[VFDBG] Sample log item:`, logs[0]);
  }
  
  const messages: MessageNormalized[] = [];

  for (let i = 0; i < logs.length; i++) {
    const item = logs[i];
    console.log(`[VFDBG] Processing log item ${i + 1}:`, item);
    
    // Extract timestamp
    const ts = item?.createdAt || item?.timestamp || item?.time || item?.ts || new Date().toISOString();
    
    let role = "system";
    let text = "";
    let shouldInclude = false;
    
    // Handle Voiceflow-specific message types
    if (item?.type === "action" && item?.data?.type === "text") {
      // User message
      role = "user";
      text = item?.data?.payload || "";
      
      // Clean up text if it starts with "Testo: "
      if (typeof text === 'string' && text.startsWith("Testo: ")) {
        text = text.substring(7);
      }
      
      shouldInclude = true;
      console.log(`[VFDBG] Found USER message: "${text}"`);
      
    } else if (item?.type === "trace" && (item?.data?.type === "speak" || item?.data?.type === "text")) {
      // Assistant message
      role = "assistant";
      
      // Try different paths for assistant text
      if (typeof item?.data?.payload?.message === "string" && item.data.payload.message.trim()) {
        text = item.data.payload.message;
      } else if (typeof item?.data?.payload?.text === "string" && item.data.payload.text.trim()) {
        text = item.data.payload.text;
      } else if (typeof item?.data?.payload === "string" && item.data.payload.trim()) {
        text = item.data.payload;
      }
      
      shouldInclude = true;
      console.log(`[VFDBG] Found ASSISTANT message: "${text}"`);
      
    } else {
      // System/debug message - check if it contains meaningful text
      if (item?.type === "trace" && typeof item?.data?.payload === "string" && item.data.payload.trim()) {
        // Some trace messages might contain assistant responses
        text = item.data.payload;
        if (text.length > 50 && !text.includes('"type"') && !text.includes('blockID')) {
          role = "assistant";
          shouldInclude = true;
          console.log(`[VFDBG] Found ASSISTANT message in trace: "${text.substring(0, 100)}..."`);
        }
      }
      
      if (!shouldInclude) {
        console.log(`[VFDBG] Skipping system message: type="${item?.type}", data.type="${item?.data?.type}"`);
      }
    }

    // Only include conversation messages with valid text
    if (shouldInclude && text && typeof text === 'string' && text.trim().length > 0) {
      const key = `${transcriptId}|${ts}|${role}|${hashText(text)}`;
      messages.push({ transcriptId, ts, role, text: text.trim(), key });
      console.log(`[VFDBG] ✅ Added message: role="${role}", text="${text.trim().substring(0, 50)}..."`);
    } else if (shouldInclude) {
      console.log(`[VFDBG] ❌ Skipping item ${i + 1} - no valid text found`);
    }
  }
  
  console.log(`[VFDBG] === NORMALIZE END: ${messages.length} messages extracted ===`);
  return messages;
}

function dedup(messages: MessageNormalized[]): MessageNormalized[] {
  console.log(`[VFDBG] === DEDUP START: ${messages.length} messages ===`);
  const seen = new Set<string>();
  const result = messages.filter(msg => {
    if (seen.has(msg.key)) {
      console.log(`[VFDBG] Removing duplicate: ${msg.key.substring(0, 50)}...`);
      return false;
    }
    seen.add(msg.key);
    return true;
  });
  console.log(`[VFDBG] === DEDUP END: ${result.length} unique messages ===`);
  return result;
}

// Components
function HeaderInfo({ idx, detail }: { idx: TranscriptIndex; detail?: TranscriptDetailResponse }) {
  const created = detail?.meta?.createdAt ?? idx?.createdAt ?? null;
  const ended = detail?.meta?.endedAt ?? idx?.endedAt ?? null;
  const duration = detail?.meta?.durationSec ?? null;
  const inProgress = !ended;

  return (
    <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-700 bg-gray-800/50 p-4">
      <div className="text-sm space-y-1">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400">Ultima sessione:</span>
          <span className="text-gray-100">{formatDateTime(created)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400">Durata:</span>
          <span className="text-gray-100">{formatDuration(duration)}</span>
        </div>
      </div>
      <div>
        {inProgress ? (
          <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-300 border border-yellow-500/30">
            In corso
          </span>
        ) : (
          <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300 border border-green-500/30">
            Terminata
          </span>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ role, ts, text }: { role: string; ts: string; text: string }) {
  const isUser = role.includes("user");
  const isAssistant = role.includes("assistant") || role.includes("agent") || role.includes("ai");
  
  const justify = isUser ? "justify-start" : isAssistant ? "justify-end" : "justify-center";
  const bubbleClass = isUser
    ? "bg-gray-700 text-gray-100 border-gray-600"
    : isAssistant
    ? "bg-red-800/40 text-red-100 border-red-700/50"
    : "bg-gray-600/50 text-gray-100 border-gray-500/30";

  const avatar = isUser ? "👤" : isAssistant ? "🤖" : "⚙️";
  const maxWidth = isUser || isAssistant ? "max-w-[75%]" : "max-w-[50%]";

  return (
    <div className={`flex ${justify} mb-4`}>
      <div className={`${maxWidth} rounded-2xl px-4 py-3 border ${bubbleClass}`}>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs">{avatar}</span>
          <span className="text-[10px] opacity-60">
            {formatDateTime(ts)} • {role}
          </span>
        </div>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {text}
        </div>
      </div>
    </div>
  );
}

function TranscriptSeparator({ idx, detail }: { idx: TranscriptIndex; detail?: TranscriptDetailResponse }) {
  const created = detail?.meta?.createdAt ?? idx?.createdAt ?? null;
  const duration = detail?.meta?.durationSec ?? null;

  const dateStr = formatDateTime(created);
  const durationStr = formatDuration(duration);

  return (
    <div className="my-8 flex items-center">
      <div className="flex-1 border-t border-gray-600"></div>
      <div className="px-4 text-xs text-gray-400 bg-gray-800 rounded-full py-1 border border-gray-600">
        ── Sessione: {dateStr} • durata {durationStr} ──
      </div>
      <div className="flex-1 border-t border-gray-600"></div>
    </div>
  );
}

// Main component
export default function ConversazioniPage() {
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [take] = useState(10);
  const [skip, setSkip] = useState(0);
  
  // Transcript indices cache
  const [indices, setIndices] = useState<TranscriptIndex[]>([]);
  
  // Loaded transcript details (id -> detail)
  const [detailsById, setDetailsById] = useState<Record<string, TranscriptDetailResponse>>({});
  
  // Normalized thread to display
  const [thread, setThread] = useState<MessageNormalized[]>([]);

  // API helpers
  async function apiList(sessionID: string, takeVal: number, skipVal: number): Promise<{ transcripts: TranscriptIndex[] }> {
    console.log(`[VFDBG] Calling vf_list_transcripts: sessionID=${sessionID}, take=${takeVal}, skip=${skipVal}`);
    
    const res = await fetch(`${SUPABASE_FN_BASE}/VF_list_transcripts`, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({ sessionID, take: takeVal, skip: skipVal, order: "DESC" })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[VFDBG] vf_list_transcripts failed: ${res.status} - ${errorText}`);
      throw new Error(`Lista transcript fallita: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log(`[VFDBG] vf_list_transcripts success:`, data);
    return data;
  }

  async function apiDetail(transcriptID: string): Promise<TranscriptDetailResponse> {
    console.log(`[VFDBG] Calling vf-get-transcript: transcriptID=${transcriptID}`);
    
    const res = await fetch(`${SUPABASE_FN_BASE}/vf_get_transcript?transcriptID=${transcriptID}`, {
      method: "GET",
      headers: commonHeaders
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[VFDBG] vf-get-transcript failed: ${res.status} - ${errorText}`);
      throw new Error(`Dettaglio transcript fallito: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log(`[VFDBG] vf-get-transcript success for ${transcriptID}:`, data);
    console.log(`[VFDBG] Full response structure:`, JSON.stringify(data, null, 2));
    return data;
  }

  // Search handler - load initial (most recent) transcript
  async function handleSearch() {
    if (!sessionId.trim()) return;
    
    console.log(`[VFDBG] ===== SEARCH START =====`);
    setError(null);
    setIsLoading(true);
    setIndices([]);
    setDetailsById({});
    setThread([]);
    setSkip(0);

    try {
      console.log(`[VFDBG] Starting search for sessionID: ${sessionId.trim()}`);
      
      // Get transcript list
      const listResult = await apiList(sessionId.trim(), take, 0);
      const transcripts = listResult?.transcripts ?? [];
      
      console.log(`[VFDBG] Found ${transcripts.length} transcript indices`);
      setIndices(transcripts);

      if (transcripts.length === 0) {
        console.log(`[VFDBG] No transcripts found for sessionID: ${sessionId.trim()}`);
        return;
      }

      // Get the most recent transcript detail (first in DESC order)
      const firstId = transcripts[0].id;
      console.log(`[VFDBG] Loading most recent transcript: ${firstId}`);
      
      const detail = await apiDetail(firstId);
      setDetailsById({ [firstId]: detail });

      // Normalize and set initial thread
      const msgs = normalize(firstId, detail.transcript);
      console.log(`[VFDBG] Normalized ${msgs.length} messages from transcript ${firstId}`);
      
      const dedupMsgs = dedup(msgs);
      console.log(`[VFDBG] After dedup: ${dedupMsgs.length} messages`);
      
      // Sort messages by timestamp (oldest first within this transcript)
      const sortedMsgs = dedupMsgs.sort((a, b) => {
        const timeA = new Date(a.ts).getTime();
        const timeB = new Date(b.ts).getTime();
        return timeA - timeB;
      });
      
      console.log(`[VFDBG] Setting thread with ${sortedMsgs.length} messages`);
      setThread(sortedMsgs);
      
      console.log(`[VFDBG] ===== SEARCH END =====`);
      
    } catch (e: any) {
      console.error(`[VFDBG] Error in handleSearch:`, e);
      setError(e?.message || String(e));
    } finally {
      setIsLoading(false);
    }
  }

  // Load more handler - lazy load older transcripts
  async function handleLoadMore() {
    if (!sessionId.trim() || isLoading) return;
    
    console.log(`[VFDBG] ===== LOAD MORE START =====`);
    setIsLoading(true);
    setError(null);
    
    try {
      const nextSkip = skip + take;
      console.log(`[VFDBG] Loading more transcripts: skip=${nextSkip}, take=${take}`);
      
      // Get next page of transcript indices
      const listResult = await apiList(sessionId.trim(), take, nextSkip);
      const newTranscripts = listResult?.transcripts ?? [];
      
      console.log(`[VFDBG] Found ${newTranscripts.length} additional transcript indices`);

      if (newTranscripts.length === 0) {
        console.log(`[VFDBG] No more transcripts to load`);
        setSkip(nextSkip);
        return;
      }

      // Append new indices
      setIndices(prev => [...prev, ...newTranscripts]);

      // Load details for each new transcript and collect messages
      const newMessages: MessageNormalized[] = [];
      const newDetails: Record<string, TranscriptDetailResponse> = {};
      
      for (const transcript of newTranscripts) {
        if (!transcript?.id) continue;
        
        // Skip if already loaded
        if (detailsById[transcript.id]) {
          console.log(`[VFDBG] Using cached transcript: ${transcript.id}`);
          const cached = detailsById[transcript.id];
          newMessages.push(...normalize(transcript.id, cached.transcript));
          continue;
        }
        
        console.log(`[VFDBG] Loading transcript detail: ${transcript.id}`);
        const detail = await apiDetail(transcript.id);
        newDetails[transcript.id] = detail;
        
        const msgs = normalize(transcript.id, detail.transcript);
        // Sort messages within this transcript (oldest first)
        const sortedMsgs = msgs.sort((a, b) => {
          const timeA = new Date(a.ts).getTime();
          const timeB = new Date(b.ts).getTime();
          return timeA - timeB;
        });
        
        newMessages.push(...sortedMsgs);
      }

      // Update details cache
      setDetailsById(prev => ({ ...prev, ...newDetails }));

      console.log(`[VFDBG] Adding ${newMessages.length} new messages to thread`);
      
      // Append new messages to thread (older transcripts go below)
      setThread(prev => {
        const combined = [...newMessages, ...prev];
        const deduped = dedup(combined);
        console.log(`[VFDBG] Total thread after append: ${deduped.length} messages`);
        // Sort all messages chronologically (oldest first)
        return deduped.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
      });
      setSkip(nextSkip);
      
      console.log(`[VFDBG] ===== LOAD MORE END =====`);
      
    } catch (e: any) {
      console.error(`[VFDBG] Error in handleLoadMore:`, e);
      setError(e?.message || String(e));
    } finally {
      setIsLoading(false);
    }
  }

  // Group messages by transcript for separators
  const threadWithSeparators = React.useMemo(() => {
    console.log(`[VFDBG] Creating thread with separators from ${thread.length} messages`);
    
    const result: (MessageNormalized | { type: 'separator'; transcriptId: string })[] = [];
    let currentTranscriptId = '';
    
    for (const msg of thread) {
      if (msg.transcriptId !== currentTranscriptId) {
        if (currentTranscriptId !== '') {
          // Add separator before changing transcript
          result.push({ type: 'separator', transcriptId: msg.transcriptId });
        }
        currentTranscriptId = msg.transcriptId;
      }
      result.push(msg);
    }
    
    console.log(`[VFDBG] Thread with separators: ${result.length} total items`);
    return result;
  }, [thread]);

  const hasMoreToLoad = indices.length >= take;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="mx-auto max-w-5xl p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Conversazioni cliente
          </h1>
          <p className="text-sm text-gray-400">
            Inserisci il <b>session_id</b> (telefono) per visualizzare i transcript Voiceflow.
          </p>
        </div>

        {/* Search Input */}
        <div className="flex gap-3 items-end mb-8">
          <div className="flex-1">
            <label htmlFor="session-id" className="block text-sm mb-2 text-gray-300">
              Session ID (telefono)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="session-id"
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="es. +393401234567"
                className="w-full pl-10 pr-3 py-3 rounded-2xl border border-gray-600 bg-gray-800/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={isLoading}
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={!sessionId.trim() || isLoading}
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span>Cerca...</span>
              </div>
            ) : (
              'Cerca'
            )}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-600 bg-red-900/30 p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-200 mb-1">
                  Errore caricamento conversazioni
                </h3>
                <p className="text-sm text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header Info (only if we have transcripts) */}
        {indices.length > 0 && indices[0] && (
          <HeaderInfo 
            idx={indices[0]} 
            detail={detailsById[indices[0].id]} 
          />
        )}

        {/* Debug Info */}
        {indices.length > 0 && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Debug Info:</h3>
            <div className="text-xs text-gray-400 space-y-1">
              <p>📊 Total transcripts found: {indices.length}</p>
              <p>💬 Messages in thread: {thread.length}</p>
              <p>📝 Details loaded: {Object.keys(detailsById).length}</p>
              <p>🔄 Current skip: {skip}</p>
            </div>
          </div>
        )}

        {/* Thread messages */}
        <div className="space-y-1">
          {/* Empty state when no session searched yet */}
          {!sessionId && !isLoading && thread.length === 0 && (
            <div className="text-center py-16">
              <MessageCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                Visualizza conversazioni cliente
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Inserisci un session ID (numero di telefono) per iniziare a visualizzare 
                le conversazioni Voiceflow del cliente.
              </p>
            </div>
          )}

          {/* Empty state when session searched but no results */}
          {sessionId && !isLoading && thread.length === 0 && !error && indices.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                Nessuna conversazione trovata per questo session ID
              </p>
            </div>
          )}

          {/* Empty state when transcripts found but no messages */}
          {sessionId && !isLoading && thread.length === 0 && !error && indices.length > 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                Transcript trovato ma nessun messaggio estratto
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Controlla la console per i dettagli del debug
              </p>
            </div>
          )}
          
          {/* Render thread with separators */}
          {threadWithSeparators.map((item, index) => {
            if ('type' in item && item.type === 'separator') {
              const idx = indices.find(i => i.id === item.transcriptId);
              const detail = detailsById[item.transcriptId];
              return (
                <TranscriptSeparator 
                  key={`separator-${item.transcriptId}-${index}`}
                  idx={idx!}
                  detail={detail}
                />
              );
            } else {
              const msg = item as MessageNormalized;
              return (
                <MessageBubble 
                  key={msg.key}
                  role={msg.role}
                  ts={msg.ts}
                  text={msg.text}
                />
              );
            }
          })}
        </div>

        {/* Load More Button */}
        {hasMoreToLoad && thread.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-6 py-3 rounded-2xl bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-100 font-medium border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Caricamento...</span>
                </div>
              ) : (
                'Carica conversazioni precedenti'
              )}
            </button>
          </div>
        )}

        {/* Alternative load more for debug (when no messages but transcripts exist) */}
        {hasMoreToLoad && thread.length === 0 && indices.length > 0 && !isLoading && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 rounded-2xl bg-yellow-600 hover:bg-yellow-500 text-white font-medium border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
            >
              Prova a caricare transcript precedenti
            </button>
          </div>
        )}
      </main>
    </div>
  );
}