import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cliente: SupabaseClient | null = null;

/**
 * Cliente de Supabase para Server Components y Server Actions.
 * Usa la clave pública (anon / publishable): todo el acceso está
 * gobernado por las políticas RLS definidas en supabase/schema.sql.
 */
export function getSupabase(): SupabaseClient {
  if (cliente) return cliente;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan las variables de entorno SUPABASE_URL y/o SUPABASE_ANON_KEY. Revisa .env.example.",
    );
  }

  cliente = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cliente;
}
