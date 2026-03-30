import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = getSupabaseAdmin()
  if (!sb) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })

  const tenantId = session.tenantId
  const query = sb.from('leads').select('*').order('created_at', { ascending: false })
  // Filtrar por tenant si existe (multi-tenant)
  const { data, error } = tenantId
    ? await query.eq('tenant_id', tenantId)
    : await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  const validKey = process.env.CRM_API_KEY ?? 'rodai-n8n-key-2026'
  const session = await getSession()
  if (apiKey !== validKey && !session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = getSupabaseAdmin()
  if (!sb) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })

  const body = await req.json()
  const fuente = body.fuente ?? (session ? 'crm' : 'whatsapp')

  // tenant_id: desde session (UI) o desde body (n8n enviando con su tenant)
  const tenantId = session?.tenantId ?? body.tenant_id ?? null

  const { data, error } = await sb.from('leads').upsert({
    telefono: body.telefono ?? '', nombre: body.nombre ?? '',
    correo: body.correo ?? '', empresa: body.empresa ?? '',
    faq_respuestas: body.faq_respuestas ?? '', idioma: body.idioma ?? 'espanol',
    fecha: body.fecha ?? new Date().toLocaleDateString('es-CR'),
    fuente, estado: body.estado ?? 'nuevo', notas: body.notas ?? '',
    paquetes_contratados: body.paquetes_contratados ?? '[]',
    frecuencia_pago: body.frecuencia_pago ?? 'mensual',
    valor_oportunidad: Number(body.valor_oportunidad) || 0,
    fecha_cierre_esperada: body.fecha_cierre_esperada ?? null,
    probabilidad: Number(body.probabilidad) || 10,
    tenant_id: tenantId,
  }, { onConflict: 'telefono' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, data })
}
