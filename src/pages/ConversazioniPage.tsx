import React, { useState, useEffect, useRef } from 'react';
import { Search, MessageCircle, Phone, Clock, ChevronUp, Loader2, Users, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Conversation {
  id: string;
  user_id: string;
  started_at: string;
  is_closed: boolean;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'Cliente' | 'Agente';
  text_line: string;
  timestamp: string;
}

interface ConversationData {
  conversation: Conversation | null;
  messages: Message[];
  has_more: boolean;
  all_conversations: Conversation[];
  has_previous_conversation: boolean;
}

export function ConversazioniPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [conversationData, setConversationData] = useState<ConversationData | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
      setShouldScrollToBottom(false);
    }
  }, [conversationData?.messages, shouldScrollToBottom]);

  // Sottoscrizione ai messaggi in tempo reale
  useEffect(() => {
    if (!conversationData?.conversation?.id) {
      return;
    }

    const conversationId = conversationData.conversation.id;
    console.log(`🔔 Subscribing to real-time messages for conversation: ${conversationId}`);

    const subscription = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('🔔 Nuovo messaggio ricevuto:', payload.new);
          
          const newMessage = payload.new as Message;
          
          // Aggiorna lo stato aggiungendo il nuovo messaggio
          setConversationData(prev => {
            if (!prev) return prev;
            
            // Verifica che il messaggio non sia già presente (evita duplicati)
            const messageExists = prev.messages.some(msg => msg.id === newMessage.id);
            if (messageExists) {
              return prev;
            }
            
            return {
              ...prev,
              messages: [...prev.messages, newMessage]
            };
          });
          
          // Attiva lo scroll automatico per il nuovo messaggio
          setShouldScrollToBottom(true);
        }
      )
      .subscribe();

    // Cleanup function per evitare memory leak
    return () => {
      console.log(`🔔 Unsubscribing from messages for conversation: ${conversationId}`);
      subscription.unsubscribe();
    };
  }, [conversationData?.conversation?.id]);

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    // Add +39 prefix if not present
    if (digits.length > 0 && !digits.startsWith('39')) {
      return `+39${digits}`;
    } else if (digits.startsWith('39')) {
      return `+${digits}`;
    }
    return phone;
  };

  const searchConversations = async (resetScroll = true, specificConversationId?: string) => {
    if (!phoneNumber.trim()) {
      setError('Inserisci un numero di telefono');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber.trim());
      
      console.log(`🔍 Searching conversations for: ${formattedPhone}${specificConversationId ? ` (conversation: ${specificConversationId})` : ''}`);

      const requestBody: any = { 
        user_id: formattedPhone,
        limit: 30
      };
      
      if (specificConversationId) {
        requestBody.conversation_id = specificConversationId;
      }

      const { data, error: functionError } = await supabase.functions.invoke('get-conversations', {
        body: requestBody
      });

      if (functionError) {
        throw functionError;
      }

      setConversationData(data);
      setCurrentConversationId(data.conversation?.id || null);
      if (resetScroll) {
        setShouldScrollToBottom(true);
      }
      
      console.log(`✅ Loaded conversation with ${data.messages?.length || 0} messages`);

    } catch (err) {
      console.error('Error searching conversations:', err);
      setError(err instanceof Error ? err.message : 'Errore durante la ricerca');
      setConversationData(null);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!conversationData?.conversation || !conversationData.has_more || loadingMore) {
      return;
    }

    setLoadingMore(true);

    try {
      const oldestMessage = conversationData.messages[0];
      if (!oldestMessage) return;

      const { data, error: functionError } = await supabase.functions.invoke('get-conversations', {
        body: { 
          user_id: conversationData.conversation.user_id,
          conversation_id: conversationData.conversation.id,
          before_timestamp: oldestMessage.timestamp,
          limit: 30
        }
      });

      if (functionError) {
        throw functionError;
      }

      // Prepend older messages to the existing ones
      setConversationData(prev => prev ? {
        ...prev,
        messages: [...data.messages, ...prev.messages],
        has_more: data.has_more
      } : null);

      console.log(`✅ Loaded ${data.messages?.length || 0} more messages`);

    } catch (err) {
      console.error('Error loading more messages:', err);
      setError(err instanceof Error ? err.message : 'Errore durante il caricamento');
    } finally {
      setLoadingMore(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchConversations();
    }
  };

  const handleConversationChange = (conversationId: string) => {
    if (conversationId !== currentConversationId) {
      searchConversations(true, conversationId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <MessageCircle className="h-6 w-6 mr-2" aria-hidden="true" />
            Conversazioni
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Cerca le conversazioni inserendo il numero di telefono del cliente
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Numero di telefono (es. 320 1234567)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onKeyDown={handleKeyDown}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              aria-label="Numero di telefono"
            />
          </div>
          <div className="mt-2 flex">
            <button
              onClick={() => searchConversations()}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Ricerca...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Cerca
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
              <div className="ml-3">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {conversationData && !conversationData.conversation && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Nessuna conversazione trovata
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Non ci sono conversazioni per questo numero di telefono.
            </p>
          </div>
        )}

        {/* Chat Interface */}
        {conversationData?.conversation && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {conversationData.conversation.user_id}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Iniziata: {formatTimestamp(conversationData.conversation.started_at)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    conversationData.conversation.is_closed
                      ? 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                  }`}>
                    {conversationData.conversation.is_closed ? 'Chiusa' : 'Attiva'}
                  </span>
                </div>
              </div>
              
              {/* Conversation Selector */}
              {conversationData.all_conversations.length > 1 && (
                <div className="mt-4">
                  <label htmlFor="conversation-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Seleziona conversazione:
                  </label>
                  <select
                    id="conversation-select"
                    value={currentConversationId || ''}
                    onChange={(e) => handleConversationChange(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {conversationData.all_conversations.map((conv) => (
                      <option key={conv.id} value={conv.id}>
                        {formatTimestamp(conv.started_at)} - {conv.is_closed ? 'Chiusa' : 'Attiva'}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {conversationData.has_more && (
              <div className="p-4 text-center border-b border-gray-200 dark:border-gray-600">
                <button
                  onClick={loadMoreMessages}
                  disabled={loadingMore}
                  className="inline-flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Caricamento...
                    </>
                  ) : (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Carica messaggi precedenti
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900"
            >
              {conversationData.messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_type === 'Agente' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                      message.sender_type === 'Agente'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text_line}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender_type === 'Agente'
                        ? 'text-blue-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}