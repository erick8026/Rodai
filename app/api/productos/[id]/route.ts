import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = getSupabase()
  if (!sb) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  const { id } = await params
  const body = await req.json()
  const { data, error } = await sb.from('productos').update({
    sku: body.sku, nombre: body.nombre,
    descripcion: body.descripcion ?? '',
    costo: Number(body.costo) || 0,
    precio_mensual: Number(body.precio_mensual) || 0,
    precio_anual: Number(body.precio_anual) || 0,
    activo: body.activo ?? true,
  }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = getSupabase()
  if (!sb) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  const { id } = await params
  const { error } = await sb.from('productos').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
