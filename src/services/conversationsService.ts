import { supabase } from '../lib/supabase';

export interface Conversation {
  id: string;
  user_id: string;
  started_at: string;
  updated_at: string;
  is_closed: boolean;
  closed_at?: string;
  is_favorite?: boolean;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'Cliente' | 'Agente';
  text_line: string;
  timestamp: string;
}

export interface ConversationWithLastMessage extends Conversation {
  lastMessage?: Message;
  clientName?: string;
  unreadCount?: number;
}

export async function getAllConversations(): Promise<ConversationWithLastMessage[]> {
  console.log('🔍 Fetching all conversations from Supabase');
  
  try {
    // Get all conversations ordered by updated_at (most recent first)
    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
      throw conversationsError;
    }

    if (!conversations || conversations.length === 0) {
      console.log('No conversations found');
      return [];
    }

    console.log(`✅ Found ${conversations.length} conversations`);

    // Get the last message for each conversation
    const conversationsWithMessages: ConversationWithLastMessage[] = await Promise.all(
      conversations.map(async (conversation) => {
        try {
          // Get the last message for this conversation
          const { data: lastMessage, error: messageError } = await supabase
            .from('messages')
            .select('id, conversation_id, sender_type, text_line, timestamp')
            .eq('conversation_id', conversation.id)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single();

          if (messageError && messageError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.warn(`Warning fetching last message for conversation ${conversation.id}:`, messageError);
          }

          // Try to get client name from clients table by matching phone numbers
          let clientName: string | undefined;
          try {
            const { data: client } = await supabase
              .from('clients')
              .select('nominativo')
              .eq('telefono', conversation.user_id)
              .single();
            
            clientName = client?.nominativo || undefined;
          } catch (error) {
            // Client not found, that's fine
            console.log(`No client found for user_id: ${conversation.user_id}`);
          }

          return {
            ...conversation,
            lastMessage: lastMessage || undefined,
            clientName,
            unreadCount: 0, // TODO: Calculate actual unread count if needed
          };
        } catch (error) {
          console.error(`Error processing conversation ${conversation.id}:`, error);
          return {
            ...conversation,
            clientName: undefined,
            unreadCount: 0,
          };
        }
      })
    );

    console.log(`✅ Processed ${conversationsWithMessages.length} conversations with messages`);
    return conversationsWithMessages;

  } catch (error) {
    console.error('Error in getAllConversations:', error);
    throw error;
  }
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  console.log(`🔍 Fetching messages for conversation: ${conversationId}`);
  
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('id, conversation_id, sender_type, text_line, timestamp')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    console.log(`✅ Found ${messages?.length || 0} messages for conversation ${conversationId}`);
    return messages || [];
  } catch (error) {
    console.error('Error in getConversationMessages:', error);
    throw error;
  }
}

export async function searchConversationsByPhone(phoneNumber: string): Promise<ConversationWithLastMessage[]> {
  console.log(`🔍 Searching conversations for phone: ${phoneNumber}`);

  try {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', phoneNumber)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error searching conversations:', error);
      throw error;
    }

    if (!conversations || conversations.length === 0) {
      console.log(`No conversations found for phone: ${phoneNumber}`);
      return [];
    }

    // Get last messages for found conversations
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conversation) => {
        const { data: lastMessage } = await supabase
          .from('messages')
          .select('id, conversation_id, sender_type, text_line, timestamp')
          .eq('conversation_id', conversation.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        // Try to get client name
        let clientName: string | undefined;
        try {
          const { data: client } = await supabase
            .from('clients')
            .select('nominativo')
            .eq('telefono', conversation.user_id)
            .single();

          clientName = client?.nominativo || undefined;
        } catch (error) {
          // Client not found
        }

        return {
          ...conversation,
          lastMessage: lastMessage || undefined,
          clientName,
          unreadCount: 0,
        };
      })
    );

    console.log(`✅ Found ${conversationsWithMessages.length} conversations for phone ${phoneNumber}`);
    return conversationsWithMessages;

  } catch (error) {
    console.error('Error in searchConversationsByPhone:', error);
    throw error;
  }
}

export async function toggleFavoriteConversation(conversationId: string, isFavorite: boolean): Promise<boolean> {
  console.log(`⭐ Toggling favorite for conversation ${conversationId} to ${isFavorite}`);

  try {
    const { error } = await supabase
      .from('conversations')
      .update({ is_favorite: isFavorite })
      .eq('id', conversationId);

    if (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }

    console.log(`✅ Successfully toggled favorite for conversation ${conversationId}`);
    return true;
  } catch (error) {
    console.error('Error in toggleFavoriteConversation:', error);
    return false;
  }
}

export async function getFavoriteConversations(): Promise<ConversationWithLastMessage[]> {
  console.log('⭐ Fetching favorite conversations');

  try {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('is_favorite', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorite conversations:', error);
      throw error;
    }

    if (!conversations || conversations.length === 0) {
      console.log('No favorite conversations found');
      return [];
    }

    // Get last messages for favorite conversations
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conversation) => {
        const { data: lastMessage } = await supabase
          .from('messages')
          .select('id, conversation_id, sender_type, text_line, timestamp')
          .eq('conversation_id', conversation.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        // Try to get client name
        let clientName: string | undefined;
        try {
          const { data: client } = await supabase
            .from('clients')
            .select('nominativo')
            .eq('telefono', conversation.user_id)
            .single();

          clientName = client?.nominativo || undefined;
        } catch (error) {
          // Client not found
        }

        return {
          ...conversation,
          lastMessage: lastMessage || undefined,
          clientName,
          unreadCount: 0,
        };
      })
    );

    console.log(`✅ Found ${conversationsWithMessages.length} favorite conversations`);
    return conversationsWithMessages;

  } catch (error) {
    console.error('Error in getFavoriteConversations:', error);
    throw error;
  }
}