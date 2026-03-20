import Link from 'next/link'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { getSession } from '@/lib/auth'
import { getSupabase, ESTADOS, PROBABILIDAD_POR_ESTADO, Lead } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import DashboardCharts from '@/components/DashboardCharts'
import DashboardFinanciero, { FunnelItem, MonthItem, ForecastItem } from '@/components/DashboardFinanciero'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  noStore()
  const session = await getSession()
  if (!session) redirect('/')

  let all: Lead[] = []
  try {
    const sb = getSupabase()
    if (sb) {
      const { data } = await sb.from('leads').select('*').order('created_at', { ascending: false })
      all = data ?? []
    }
  } catch (_) {}

  /* ── Métricas generales ── */
  const total = all.length
  const nuevos = all.filter(l => l.estado === 'nuevo').length
  const enSeguimiento = all.filter(l => l.estado === 'en_seguimiento').length
  const ganados = all.filter(l => l.estado === 'cerrado_ganado').length
  const convRate = total > 0 ? Math.round((ganados / total) * 100) : 0
  const valorPipeline = all
    .filter(l => l.estado !== 'cerrado_perdido')
    .reduce((s, l) => s + (l.valor_oportunidad ?? 0), 0)
  const fmtUSD = (n: number) => n.toLocaleString('es-CR', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })

  /* ── Métricas financieras ── */
  const now = new Date()
  const mesActual = now.getFullYear() * 100 + now.getMonth() // yyyymm comparable

  function mesKey(dateStr: string | null | undefined): number {
    if (!dateStr) return 0
    const d = new Date(dateStr)
    return d.getFullYear() * 100 + d.getMonth()
  }

  const ganadoTotal  = all.filter(l => l.estado === 'cerrado_ganado').reduce((s, l) => s + (l.valor_oportunidad ?? 0), 0)
  const ganadoMes    = all.filter(l => l.estado === 'cerrado_ganado' && mesKey(l.updated_at) === mesActual).reduce((s, l) => s + (l.valor_oportunidad ?? 0), 0)
  const perdidoMes   = all.filter(l => l.estado === 'cerrado_perdido' && mesKey(l.updated_at) === mesActual).reduce((s, l) => s + (l.valor_oportunidad ?? 0), 0)

  const activeLeads  = all.filter(l => l.estado !== 'cerrado_ganado' && l.estado !== 'cerrado_perdido')
  const pipelineActivo  = activeLeads.reduce((s, l) => s + (l.valor_oportunidad ?? 0), 0)
  const pipelinePonderado = activeLeads.reduce((s, l) => {
    const prob = l.probabilidad ?? PROBABILIDAD_POR_ESTADO[l.estado] ?? 10
    return s + (l.valor_oportunidad ?? 0) * prob / 100
  }, 0)

  const totalCerrados = all.filter(l => l.estado === 'cerrado_ganado' || l.estado === 'cerrado_perdido').length
  const tasaCierre = totalCerrados > 0 ? Math.round((ganados / totalCerrados) * 100) : 0

  /* ── Funnel por etapa ── */
  const funnelEstados: Array<{ key: Lead['estado']; label: string; color: string }> = [
    { key: 'nuevo',              label: 'Nuevo',              color: '#3b82f6' },
    { key: 'en_seguimiento',     label: 'En seguimiento',     color: '#f59e0b' },
    { key: 'cotizacion_enviada', label: 'Cotización enviada', color: '#8b5cf6' },
    { key: 'cerrado_ganado',     label: 'Cerrado ganado',     color: '#10b981' },
  ]
  const funnel: FunnelItem[] = funnelEstados.map(e => {
    const group = all.filter(l => l.estado === e.key)
    return { name: e.label, value: group.reduce((s, l) => s + (l.valor_oportunidad ?? 0), 0), count: group.length, color: e.color }
  })

  /* ── Revenue por mes (últimos 6 meses) ── */
  const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  const porMes: MonthItem[] = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const key = d.getFullYear() * 100 + d.getMonth()
    const ganado = all
      .filter(l => l.estado === 'cerrado_ganado' && mesKey(l.updated_at) === key)
      .reduce((s, l) => s + (l.valor_oportunidad ?? 0), 0)
    return { mes: `${MESES[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`, ganado }
  })

  /* ── Forecast próximos 60 días ── */
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  const en60 = new Date(hoy); en60.setDate(hoy.getDate() + 60)
  const forecast: ForecastItem[] = all
    .filter(l => {
      if (!l.fecha_cierre_esperada) return false
      if (l.estado === 'cerrado_ganado' || l.estado === 'cerrado_perdido') return false
      const d = new Date(l.fecha_cierre_esperada)
      return d >= hoy && d <= en60
    })
    .map(l => {
      const d = new Date(l.fecha_cierre_esperada!)
      const dias = Math.round((d.getTime() - hoy.getTime()) / 86400000)
      const prob = l.probabilidad ?? PROBABILIDAD_POR_ESTADO[l.estado] ?? 10
      const valor = l.valor_oportunidad ?? 0
      return {
        id: l.id,
        nombre: l.nombre,
        empresa: l.empresa,
        valor,
        probabilidad: prob,
        valorPonderado: Math.round(valor * prob / 100),
        fechaCierre: d.toLocaleDateString('es-CR'),
        diasRestantes: dias,
      }
    })
    .sort((a, b) => a.diasRestantes - b.diasRestantes)

  /* ── Gráficos originales ── */
  const byEstado = Object.entries(ESTADOS).map(([key, val]) => ({
    name: val.label, estado: key,
    value: all.filter(l => l.estado === key).length,
    color: val.color,
  })).filter(d => d.value > 0)

  const idiomaCount: Record<string, number> = {}
  all.forEach(l => { const lang = l.idioma ?? 'desconocido'; idiomaCount[lang] = (idiomaCount[lang] ?? 0) + 1 })
  const byIdioma = Object.entries(idiomaCount).map(([name, value], i) => ({
    name, value, color: ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#ef4444'][i % 5]
  }))

  const fuenteConfig: Record<string, { label: string; color: string }> = {
    whatsapp: { label: '📱 WhatsApp', color: '#22c55e' },
    web:      { label: '🌐 Web',      color: '#3b82f6' },
    crm:      { label: '🖥️ CRM',      color: '#8b5cf6' },
  }
  const fuenteCount: Record<string, number> = {}
  all.forEach(l => { const f = l.fuente ?? 'whatsapp'; fuenteCount[f] = (fuenteCount[f] ?? 0) + 1 })
  const byFuente = Object.entries(fuenteCount)
    .map(([fuente, value]) => ({
      fuente, name: fuenteConfig[fuente]?.label ?? fuente,
      value, color: fuenteConfig[fuente]?.color ?? '#6b7280',
    }))
    .sort((a, b) => b.value - a.value)

  const recientes = all.slice(0, 5)
  const stats = [
    { label: 'Total leads',       value: total,          color: 'blue' },
    { label: 'Nuevos',            value: nuevos,         color: 'indigo' },
    { label: 'En seguimiento',    value: enSeguimiento,  color: 'amber' },
    { label: 'Tasa conversion',   value: `${convRate}%`, color: 'emerald' },
    { label: 'Valor del pipeline',value: fmtUSD(valorPipeline), color: 'green' },
  ]

  const notConfigured = !process.env.NEXT_PUBLIC_SUPABASE_URL

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Resumen de oportunidades RODAI</p>
        </div>

        {notConfigured && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3 items-start">
            <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-amber-800 text-sm">Supabase no configurado</p>
              <p className="text-amber-700 text-sm mt-0.5">Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel Settings → Environment Variables y redespliega.</p>
            </div>
          </div>
        )}

        {/* General stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 text-${s.color}-600`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Financial dashboard */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Dashboard Financiero</h2>
          <DashboardFinanciero
            ganado={ganadoTotal}
            ganadoMes={ganadoMes}
            pipeline={pipelineActivo}
            ponderado={pipelinePonderado}
            perdidoMes={perdidoMes}
            tasaCierre={tasaCierre}
            funnel={funnel}
            porMes={porMes}
            forecast={forecast}
          />
        </div>

        {/* Leads charts */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Distribución de leads</h2>
          <DashboardCharts byEstado={byEstado} byIdioma={byIdioma} byFuente={byFuente} />
        </div>

        {/* Recent leads */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Leads recientes</h2>
            <Link href="/leads" className="text-xs text-blue-600 hover:underline">Ver todos →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recientes.length === 0 && (
              <p className="px-6 py-8 text-center text-gray-400 text-sm">
                {notConfigured ? 'Configura Supabase para ver los leads' : 'No hay leads aun'}
              </p>
            )}
            {recientes.map(lead => (
              <Link key={lead.id} href={`/leads?estado=${lead.estado}`}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition block">
                <div>
                  <p className="font-medium text-sm text-gray-800">{lead.nombre || '-'}</p>
                  <p className="text-xs text-gray-400">{lead.empresa || lead.telefono}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {lead.fuente === 'web' ? '🌐 Web' : lead.fuente === 'crm' ? '🖥️ CRM' : '📱 WhatsApp'}
                  </span>
                  {(lead.valor_oportunidad ?? 0) > 0 && (
                    <span className="text-xs font-semibold text-green-700">{fmtUSD(lead.valor_oportunidad)}</span>
                  )}
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: ESTADOS[lead.estado]?.color ?? '#6b7280' }}>
                    {ESTADOS[lead.estado]?.label ?? lead.estado}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
