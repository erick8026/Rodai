import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const sb = getSupabase()
  if (!sb) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })

  const { data, error } = await sb
    .from('propuestas')
    .select('*')
    .eq('token', token)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })

  // Mark as viewed (first time only)
  if (!data.visto_at) {
    await sb.from('propuestas').update({ visto_at: new Date().toISOString() }).eq('token', token)
  }

  return NextResponse.json(data)
}
