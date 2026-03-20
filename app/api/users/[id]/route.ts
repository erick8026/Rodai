import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = getSupabaseAdmin()
  if (!sb) return NextResponse.json({ error: 'Admin client not configured' }, { status: 503 })
  const { id } = await params
  const { error } = await sb.auth.admin.deleteUser(id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
