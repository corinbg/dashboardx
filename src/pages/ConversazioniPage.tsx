import React, { useState, useEffect, useRef } from 'react';
import { Search, MessageCircle, Phone, Clock, ChevronUp, Loader2, Users, AlertTriangle, User, MapPin, Filter, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';
import { ConversationCard } from '../components/Conversations/ConversationCard';
import { getAllConversations, searchConversationsByPhone, getConversationMessages, ConversationWithLastMessage } from '../services/conversationsService';

interface ConversazioniPageProps {
  initialPhoneNumber?: string | null;
  onPhoneNumberCleared?: () => void;
}

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

export function ConversazioniPage({ initialPhoneNumber, onPhoneNumberCleared }: ConversazioniPageProps) {
  const { clients } = useApp();
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || '');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [conversations, setConversations] = useState<ConversationWithLastMessage[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<ConversationWithLastMessage[]>([]);
  const [conversationData, setConversationData] = useState<ConversationData | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'last7days' | 'last30days' | 'all'>('all');

  // Load all conversations on component mount
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const allConversations = await getAllConversations();
        setConversations(allConversations);
        applyFilters(allConversations, statusFilter, dateFilter);
      } catch (err) {
        console.error('Error loading conversations:', err);
        setError(err instanceof Error ? err.message : 'Errore durante il caricamento delle conversazioni');
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Apply filters when conversations or filter values change
  const applyFilters = (conversationsList: ConversationWithLastMessage[], status: string, date: string) => {
    let filtered = [...conversationsList];

    // Status filter
    if (status === 'open') {
      filtered = filtered.filter(conv => !conv.is_closed);
    } else if (status === 'closed') {
      filtered = filtered.filter(conv => conv.is_closed);
    }

    // Date filter
    if (date !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(conv => {
        const updatedAt = new Date(conv.updated_at);
        
        switch (date) {
          case 'today':
            return updatedAt >= today;
          case 'last7days':
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            return updatedAt >= sevenDaysAgo;
          case 'last30days':
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            return updatedAt >= thirtyDaysAgo;
          default:
            return true;
        }
      });
    }

    setFilteredConversations(filtered);
  };

  // Update filtered conversations when filters change
  useEffect(() => {
    applyFilters(conversations, statusFilter, dateFilter);
  }, [conversations, statusFilter, dateFilter]);

  // Handle client search
  const handleClientSearch = (searchTerm: string) => {
    setClientSearchTerm(searchTerm);
    
    if (searchTerm.trim().length < 2) {
      setFilteredClients([]);
      setShowClientDropdown(false);
      return;
    }

    const filtered = clients.filter(client => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (client.nominativo || '').toLowerCase().includes(searchLower) ||
        (client.luogo || '').toLowerCase().includes(searchLower) ||
        (client.indirizzo || '').toLowerCase().includes(searchLower) ||
        (client.telefono || '').toLowerCase().includes(searchLower)
      );
    });

    setFilteredClients(filtered.slice(0, 10)); // Limit to first 10 results
    setShowClientDropdown(filtered.length > 0);
  };

  const handleClientSelect = (client: any) => {
    if (client.telefono) {
      setPhoneNumber(client.telefono);
      setClientSearchTerm('');
      setFilteredClients([]);
      setShowClientDropdown(false);
      
      // Auto-search conversations for selected client phone
      handlePhoneSearch(client.telefono);
    }
  };

  const handlePhoneSearch = async (phone?: string) => {
    const searchPhone = phone || phoneNumber;
    if (!searchPhone.trim()) {
      setError('Inserisci un numero di telefono');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const phoneConversations = await searchConversationsByPhone(searchPhone.trim());
      setConversations(phoneConversations);
      applyFilters(phoneConversations, statusFilter, dateFilter);
      
      if (phoneConversations.length === 0) {
        setError('Nessuna conversazione trovata per questo numero');
      }
    } catch (err) {
      console.error('Error searching conversations:', err);
      setError(err instanceof Error ? err.message : 'Errore durante la ricerca');
    } finally {
      setLoading(false);
    }
  };

  const handleShowAllConversations = async () => {
    setPhoneNumber('');
    setLoading(true);
    setError(null);
    
    try {
      const allConversations = await getAllConversations();
      setConversations(allConversations);
      applyFilters(allConversations, statusFilter, dateFilter);
    } catch (err) {
      console.error('Error loading all conversations:', err);
      setError(err instanceof Error ? err.message : 'Errore durante il caricamento');
    } finally {
      setLoading(false);
    }
  };

  // Handle initial phone number from props
  useEffect(() => {
    if (initialPhoneNumber) {
      console.log(`🔄 Auto-searching conversations for: ${initialPhoneNumber}`);
      handlePhoneSearch(initialPhoneNumber);
      onPhoneNumberCleared?.();
    }
  }, [initialPhoneNumber, onPhoneNumberCleared]);

  const handleConversationClick = async (conversation: ConversationWithLastMessage) => {
    setLoading(true);
    setError(null);

    try {
      // Load full conversation messages
      const messages = await getConversationMessages(conversation.id);
      
      setConversationData({
        conversation: {
          id: conversation.id,
          user_id: conversation.user_id,
          started_at: conversation.started_at,
          is_closed: conversation.is_closed
        },
        messages: messages.map(msg => ({
          id: msg.id,
          conversation_id: msg.conversation_id,
          sender_type: msg.sender_type,
          text_line: msg.text_line,
          timestamp: msg.timestamp
        })),
        has_more: false,
        all_conversations: conversations.map(conv => ({
          id: conv.id,
          user_id: conv.user_id,
          started_at: conv.started_at,
          is_closed: conv.is_closed
        })),
        has_previous_conversation: false
      });
      
      setCurrentConversationId(conversation.id);
      setShouldScrollToBottom(true);
      
    } catch (err) {
      console.error('Error loading conversation messages:', err);
      setError(err instanceof Error ? err.message : 'Errore durante il caricamento dei messaggi');
    } finally {
      setLoading(false);
    }
  };

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

  const searchConversations = async (resetScroll = true, specificConversationId?: string, phoneNumToSearch?: string) => {
    const phoneToSearch = phoneNumToSearch || phoneNumber;
    if (!phoneToSearch.trim()) {
      setError('Inserisci un numero di telefono');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedPhone = formatPhoneNumber(phoneToSearch.trim());
      
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
      handlePhoneSearch();
    }
  };

  const handleConversationChange = async (conversationId: string) => {
    if (conversationId !== currentConversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        await handleConversationClick(conversation);
      }
    }
  };

  const handleStatusFilterChange = (newStatus: 'all' | 'open' | 'closed') => {
    setStatusFilter(newStatus);
  };

  const handleDateFilterChange = (newDate: 'today' | 'last7days' | 'last30days' | 'all') => {
    setDateFilter(newDate);
  };

  const getStatusCounts = () => {
    const open = conversations.filter(c => !c.is_closed).length;
    const closed = conversations.filter(c => c.is_closed).length;
    return { total: conversations.length, open, closed };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Conversazioni
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gestisci le conversazioni con i clienti
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Mobile Filters Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="md:hidden inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtri
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-screen pb-24">
        {/* Left Sidebar - Filters & Quick Access */}
        <div className={`md:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
          <div className="p-4 space-y-6">
            {/* Search Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cerca Cliente o Numero
              </label>
              <div className="space-y-4">
                {/* Client Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    placeholder="Nome, luogo, indirizzo..."
                    value={clientSearchTerm}
                    onChange={(e) => handleClientSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  
                  {/* Client Dropdown */}
                  {showClientDropdown && filteredClients.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredClients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => handleClientSelect(client)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:outline-none first:rounded-t-md last:rounded-b-md"
                        >
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {client.nominativo || 'N/D'}
                              </p>
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                                <span>{client.telefono || 'N/D'}</span>
                                {client.luogo && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {client.luogo}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Phone Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    placeholder="Numero di telefono..."
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <button
                  onClick={() => handlePhoneSearch()}
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                
                <button
                  onClick={handleShowAllConversations}
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Mostra Tutte
                </button>
              </div>
            </div>

            {/* Quick Access Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Accesso Rapido
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                  ⭐ Conversazioni Preferite
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                  🕒 Recenti
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Stato Conversazione
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => handleStatusFilterChange('all')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md font-medium transition-colors ${
                    statusFilter === 'all' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Tutte ({statusCounts.total})
                </button>
                <button 
                  onClick={() => handleStatusFilterChange('open')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    statusFilter === 'open' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  🟢 Aperte ({statusCounts.open})
                </button>
                <button 
                  onClick={() => handleStatusFilterChange('closed')}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    statusFilter === 'closed' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  ⚪ Chiuse ({statusCounts.closed})
                </button>
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Data Ultima Attività
              </h3>
              <select 
                value={dateFilter} 
                onChange={(e) => handleDateFilterChange(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">Tutte</option>
                <option value="today">Oggi</option>
                <option value="last7days">Ultimi 7 giorni</option>
                <option value="last30days">Ultimi 30 giorni</option>
              </select>
            </div>
          </div>
        </div>
        {/* Right Content Area - Conversation List */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
          {/* Chat Interface - Show when conversation is selected */}
          {conversationData?.conversation ? (
            <div className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Back Button */}
                    <button
                      onClick={() => {
                        setConversationData(null);
                        setCurrentConversationId(null);
                      }}
                      className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Torna alla lista conversazioni"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {conversationData.conversation.user_id}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Iniziata: {formatTimestamp(conversationData.conversation.started_at)}
                      </p>
                    </div>
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
                <div className="bg-white dark:bg-gray-800 p-4 text-center border-b border-gray-200 dark:border-gray-600">
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
              <div className="flex-1 overflow-hidden">
                <div 
                  ref={messagesContainerRef}
                  className="h-full overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900"
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
            </div>
          ) : (
            /* Conversation List - Show when no conversation is selected */
            <div className="p-4 sm:p-6">
              {/* Conversation List Header */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {phoneNumber ? `Conversazioni per ${phoneNumber}` : 'Conversazioni Recenti'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredConversations.length} conversazioni trovate
                </p>
              </div>

              {/* Conversation Cards List */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Caricamento conversazioni...</span>
                </div>
              ) : filteredConversations.length > 0 ? (
                <div className="space-y-4">
                  {filteredConversations.map((conversation) => (
                    <ConversationCard
                      key={conversation.id}
                      conversation={{
                        id: conversation.id,
                        user_id: conversation.user_id,
                        started_at: conversation.started_at,
                        is_closed: conversation.is_closed
                      }}
                      lastMessage={conversation.lastMessage}
                      clientName={conversation.clientName}
                      phoneNumber={conversation.user_id}
                      unreadCount={conversation.unreadCount}
                      onClick={() => handleConversationClick(conversation)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                    Nessuna conversazione trovata
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {phoneNumber 
                      ? 'Non ci sono conversazioni per questo numero di telefono.' 
                      : 'Non ci sono conversazioni che corrispondono ai filtri selezionati.'}
                  </p>
                  {phoneNumber && (
                    <button
                      onClick={handleShowAllConversations}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
                    >
                      Mostra Tutte le Conversazioni
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          </div>
      </main>

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
    </div>
  );
}