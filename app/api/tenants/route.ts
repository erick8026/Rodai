import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { getSession } from '@/lib/auth'

// Solo el owner de 'rodai' puede gestionar tenants
async function requireOwner() {
  const session = await getSession()
  if (!session) return null
  if (session.tenantSlug !== 'rodai' || session.rol !== 'owner') return null
  return session
}

export async function GET() {
  const session = await requireOwner()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const sb = getSupabaseAdmin()
  if (!sb) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  const { data, error } = await sb.from('tenants').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await requireOwner()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const sb = getSupabaseAdmin()
  if (!sb) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })

  const { slug, nombre, plan, email, password } = await req.json()
  if (!slug || !nombre || !email || !password) {
    return NextResponse.json({ error: 'slug, nombre, email y password requeridos' }, { status: 400 })
  }

  // 1. Crear tenant
  const { data: tenant, error: tenantErr } = await sb
    .from('tenants').insert({ slug, nombre, plan: plan ?? 'basico' }).select().single()
  if (tenantErr) return NextResponse.json({ error: tenantErr.message }, { status: 500 })

  // 2. Crear usuario en Supabase Auth con app_metadata del tenant
  const { data: user, error: userErr } = await sb.auth.admin.createUser({
    email,
    password,
    app_metadata: { tenant_id: tenant.id, tenant_slug: slug, rol: 'owner' },
    email_confirm: true,
  })
  if (userErr) {
    // Rollback tenant si falla el usuario
    await sb.from('tenants').delete().eq('id', tenant.id)
    return NextResponse.json({ error: userErr.message }, { status: 500 })
  }

  return NextResponse.json({ tenant, user: { id: user.user.id, email } }, { status: 201 })
}
