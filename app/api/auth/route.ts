import { NextRequest, NextResponse } from 'next/server'
import { createSession, COOKIE, MAX_AGE } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
  }

  const sb = getSupabaseAdmin()
  if (!sb) return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })

  const { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (error || !data.user) {
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
  }

  // Leer tenant desde app_metadata (asignado por admin, no editable por usuario)
  const meta = data.user.app_metadata ?? {}
  const tenantId: string = meta.tenant_id ?? ''
  const tenantSlug: string = meta.tenant_slug ?? 'rodai'
  const rol: string = meta.rol ?? 'agente'

  const token = await createSession({
    userId: data.user.id,
    email: data.user.email ?? email,
    tenantId,
    tenantSlug,
    rol,
  })

  const res = NextResponse.json({ ok: true, tenantSlug })
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(COOKIE)
  return res
}
