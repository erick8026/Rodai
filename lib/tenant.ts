import { NextRequest } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

// Obtiene tenant_id desde el header inyectado por el middleware
// (ya validado y resuelto en la capa de auth)
export function getTenantIdFromRequest(req: NextRequest): string | null {
  return req.headers.get('x-tenant-id') ?? null
}

// Resuelve tenant_id desde el slug (para rutas públicas como propuestas)
export async function resolveTenantId(slug: string): Promise<string | null> {
  const sb = getSupabaseAdmin()
  if (!sb) return null
  const { data } = await sb.from('tenants').select('id').eq('slug', slug).eq('activo', true).single()
  return data?.id ?? null
}
