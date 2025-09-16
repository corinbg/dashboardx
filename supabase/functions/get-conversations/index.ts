import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("MY_SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("MY_SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Create Supabase client with anon key
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Parse request body
    const { user_id, limit = 30, before_timestamp, conversation_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "user_id is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`🔍 Searching conversations for user_id: ${user_id}`);

    let targetConversationId = conversation_id;

    // If no specific conversation_id provided, get the latest conversation
    if (!targetConversationId) {
      const { data: latestConversation, error: convError } = await supabase
        .from('conversations')
        .select('id, started_at, is_closed')
        .eq('user_id', user_id)
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      if (convError || !latestConversation) {
        console.log(`❌ No conversations found for user_id: ${user_id}`);
        return new Response(
          JSON.stringify({ 
            conversation: null, 
            messages: [], 
            has_more: false,
            has_previous_conversation: false 
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      targetConversationId = latestConversation.id;
    }

    // Build messages query
    let messagesQuery = supabase
      .from('messages')
      .select('id, conversation_id, sender_type, text_line, timestamp')
      .eq('conversation_id', targetConversationId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    // Add before_timestamp filter if provided
    if (before_timestamp) {
      messagesQuery = messagesQuery.lt('timestamp', before_timestamp);
    }

    // Execute messages query
    const { data: messages, error: msgError } = await messagesQuery;

    if (msgError) {
      throw msgError;
    }

    // Get conversation details
    const { data: conversation, error: convDetailError } = await supabase
      .from('conversations')
      .select('id, user_id, started_at, is_closed')
      .eq('id', targetConversationId)
      .single();

    if (convDetailError) {
      throw convDetailError;
    }

    // Check if there are more messages in this conversation
    const { count: totalMessages } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', targetConversationId);

    const hasMore = (totalMessages || 0) > messages.length;

    // Check if there are previous conversations
    const { data: previousConversations } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_id', user_id)
      .lt('started_at', conversation.started_at)
      .limit(1);

    const hasPreviousConversation = (previousConversations?.length || 0) > 0;

    // Reverse messages to show oldest first in the response
    const orderedMessages = messages.reverse();

    console.log(`✅ Found conversation ${targetConversationId} with ${orderedMessages.length} messages`);

    return new Response(
      JSON.stringify({
        conversation,
        messages: orderedMessages,
        has_more: hasMore,
        has_previous_conversation: hasPreviousConversation,
        total_messages: totalMessages
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("❌ Error in get-conversations function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});