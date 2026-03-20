import { NextRequest, NextResponse } from 'next/server'
import { createSession, COOKIE, MAX_AGE } from '@/lib/auth'
import { getSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
  }

  const sb = getSupabase()
  if (!sb) {
    return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })
  }

  // Supabase Auth validates credentials — password is bcrypt-hashed, never plain text
  const { data, error } = await sb.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    // Generic message — don't reveal whether email or password was wrong
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
  }

  const token = await createSession(data.user.id, data.user.email ?? email)

  const res = NextResponse.json({ ok: true })
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
