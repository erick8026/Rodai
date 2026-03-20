import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = getSupabase()
  if (!sb) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  const { data, error } = await sb.from('leads').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  // Accept either valid session (from CRM UI) or API key (from n8n)
  const apiKey = req.headers.get('x-api-key')
  const validKey = process.env.CRM_API_KEY ?? 'rodai-n8n-key-2026'
  const session = await getSession()
  if (apiKey !== validKey && !session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sb = getSupabase()
  if (!sb) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  const body = await req.json()
  const fuente = body.fuente ?? (session ? 'crm' : 'whatsapp')
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
  }, { onConflict: 'telefono' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, data })
}
