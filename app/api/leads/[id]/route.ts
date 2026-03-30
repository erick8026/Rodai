import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { getSession } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = getSupabaseAdmin()
  if (!sb) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  const { id } = await params
  const query = sb.from('leads').select('*').eq('id', id)
  // Asegurar que el lead pertenece al tenant del usuario
  const { data, error } = session.tenantId
    ? await query.eq('tenant_id', session.tenantId).single()
    : await query.single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = getSupabaseAdmin()
  if (!sb) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  const { id } = await params
  const body = await req.json()
  const query = sb.from('leads')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
  const { data, error } = session.tenantId
    ? await query.eq('tenant_id', session.tenantId).select().single()
    : await query.select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = getSupabaseAdmin()
  if (!sb) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  const { id } = await params
  const query = sb.from('leads').delete().eq('id', id)
  const { error } = session.tenantId
    ? await query.eq('tenant_id', session.tenantId)
    : await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
