import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🚀 Initializing Supabase client:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
  key: supabaseKey ? `${supabaseKey.substring(0, 30)}...` : 'MISSING'
})

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
  throw new Error('Missing Supabase environment variables')
}

// Custom fetch to handle CORS and credentials issues in preview environments
const customFetch: typeof fetch = (input, init = {}) => {
  console.log('🔗 Custom fetch called:', { 
    url: typeof input === 'string' ? input : input.url,
    method: init?.method || 'GET'
  });
  
  return fetch(input as any, {
    ...init,
    // Disable credentials to avoid CORS issues in preview environments
    credentials: 'omit',
  });
};

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  // Remove custom fetch that may interfere with Edge Functions
})

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          nome: string
          email: string
          servizio: string
          azienda: string
          problemi: string
          info_aggiuntive: string | null
          created_at: string | null
          status: string | null
        }
        Insert: {
          id?: string
          nome: string
          email: string
          servizio: string
          azienda: string
          problemi: string
          info_aggiuntive?: string | null
          created_at?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          servizio?: string
          azienda?: string
          problemi?: string
          info_aggiuntive?: string | null
          created_at?: string | null
          status?: string | null
        }
      }
      requests: {
        Row: {
          id: string
          Nome: string
          Luogo: string
          Problema: string
          Urgenza: boolean
          Numero: string
          'Preferenza Ricontatto': string
          richiesta_at: string
          stato: 'Non letto' | 'Letto' | 'Contattato' | 'Completato'
          spam_fuori_zona: boolean
        }
        Insert: {
          id?: string
          Nome: string
          Luogo: string
          Problema: string
          Urgenza?: boolean
          Numero: string
          'Preferenza Ricontatto': string
          richiesta_at?: string
          stato?: 'Non letto' | 'Letto' | 'Contattato' | 'Completato'
          spam_fuori_zona?: boolean
        }
        Update: {
          id?: string
          Nome?: string
          Luogo?: string
          Problema?: string
          Urgenza?: boolean
          Numero?: string
          'Preferenza Ricontatto'?: string
          richiesta_at?: string
          stato?: 'Non letto' | 'Letto' | 'Contattato' | 'Completato'
          spam_fuori_zona?: boolean
        }
      }
      clients: {
        Row: {
          id: string
          nominativo: string
          telefono: string
          luogo: string | null
          indirizzo: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nominativo: string
          telefono: string
          luogo?: string | null
          indirizzo?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nominativo?: string
          telefono?: string
          luogo?: string | null
          indirizzo?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      checklist_items: {
        Row: {
          id: string
          testo: string
          completata: boolean
          completata_at: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          testo: string
          completata?: boolean
          completata_at?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          testo?: string
          completata?: boolean
          completata_at?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}