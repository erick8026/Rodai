import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth'

function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://msxycfefkmyjscodobmn.supabase.co'
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  if (!key) return null
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = getAdmin()
  if (!sb) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })

  const [{ data: conversaciones, error: e1 }, { data: incidentes, error: e2 }] = await Promise.all([
    sb.from('conversaciones_log').select('*').order('created_at', { ascending: false }).limit(50),
    sb.from('incidentes').select('*').order('created_at', { ascending: false }).limit(20),
  ])

  if (e1 || e2) {
    return NextResponse.json(
      { error: e1?.message ?? e2?.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    conversaciones: conversaciones ?? [],
    incidentes: incidentes ?? [],
  })
}
