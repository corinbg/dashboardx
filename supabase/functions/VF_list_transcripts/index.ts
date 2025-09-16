import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const VF_KEY = Deno.env.get("VF_API_KEY");
const PROJECT_ID = Deno.env.get("VF_PROJECT_ID");
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "*";

// Validate required environment variables
if (!VF_KEY || !PROJECT_ID) {
  console.error("❌ Missing required environment variables:");
  if (!VF_KEY) console.error("  - VF_API_KEY is not set");
  if (!PROJECT_ID) console.error("  - VF_PROJECT_ID is not set");
}

function corsHeaders(origin: string | null) {
  const allow = origin && ALLOWED_ORIGIN !== "*" ? ALLOWED_ORIGIN : "*";
  return {
    "access-control-allow-origin": allow,
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  } as Record<string, string>;
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        ...headers,
        'access-control-max-age': '86400',
        'content-length': '0'
      }
    });
  }

  try {
    // Check environment variables before proceeding
    if (!VF_KEY || !PROJECT_ID) {
      return new Response(JSON.stringify({ 
        error: "MISSING_ENV_VARIABLES",
        message: "VF_API_KEY and VF_PROJECT_ID must be configured in Supabase Edge Function settings",
        missing: {
          vf_api_key: !VF_KEY,
          vf_project_id: !PROJECT_ID
        }
      }), { 
        status: 500, 
        headers: { ...headers, "content-type": "application/json" } 
      });
    }

    // Handle list transcripts requests
    if (req.method === "POST") {
      const { sessionID, limit = 10, offset = 0 } = await req.json();
      if (!sessionID) throw new Error("sessionID required");

      console.log(`📋 Fetching transcripts for session: ${sessionID}, limit: ${limit}, offset: ${offset}`);

      const searchUrl = new URL(`https://analytics-api.voiceflow.com/v1/transcript/project/${PROJECT_ID}`);
      searchUrl.searchParams.set("limit", String(limit));
      searchUrl.searchParams.set("offset", String(offset));

      const vfRes = await fetch(searchUrl, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "authorization": VF_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({ sessionID }),
      });

      if (!vfRes.ok) {
        const text = await vfRes.text();
        console.error(`❌ Voiceflow search error: ${vfRes.status} - ${text}`);
        return new Response(JSON.stringify({ 
          error: "VOICEFLOW_SEARCH_ERROR", 
          status: vfRes.status, 
          text 
        }), { 
          status: 502, 
          headers: { ...headers, "content-type": "application/json" } 
        });
      }

      const data = await vfRes.json();
      console.log(`✅ Found ${data.transcripts?.length || 0} transcripts`);
      
      return new Response(JSON.stringify(data), { 
        status: 200, 
        headers: { ...headers, "content-type": "application/json" } 
      });
    }

    return new Response(JSON.stringify({ error: "METHOD_NOT_ALLOWED" }), { 
      status: 405, 
      headers: { ...headers, "content-type": "application/json" } 
    });
  } catch (e) {
    console.error(`💥 Unexpected error: ${e?.message}`);
    return new Response(JSON.stringify({ 
      error: "UNEXPECTED", 
      message: e?.message 
    }), { 
      status: 500, 
      headers: { ...headers, "content-type": "application/json" } 
    });
  }
});