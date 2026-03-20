'use client'
import { useRouter } from 'next/navigation'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type PieData = { name: string; value: number; color: string; estado?: string }

function CustomTooltip({ active, payload }: any) {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
        <p className="font-semibold text-sm text-gray-800">{payload[0].name}</p>
        <p className="text-2xl font-bold" style={{ color: payload[0].payload.color }}>
          {payload[0].value}
        </p>
        <p className="text-xs text-gray-400 mt-1">Click para filtrar</p>
      </div>
    )
  }
  return null
}

function PieSection({
  title, data, subtitle, onSliceClick
}: {
  title: string; data: PieData[]; subtitle?: string
  onSliceClick?: (entry: PieData) => void
}) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="mb-4">
        <h2 className="font-semibold text-gray-800">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {total === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-300 text-sm">Sin datos</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                onClick={onSliceClick ? (entry) => onSliceClick(entry as PieData) : undefined}
                style={onSliceClick ? { cursor: 'pointer' } : undefined}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.map(d => (
              <button
                key={d.name}
                onClick={() => onSliceClick?.(d)}
                className={`flex items-center gap-1.5 ${onSliceClick ? 'hover:opacity-70 transition cursor-pointer' : ''}`}
              >
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: d.color }} />
                <span className="text-xs text-gray-500">{d.name}: <strong>{d.value}</strong></span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function DashboardCharts({
  byEstado, byIdioma
}: {
  byEstado: PieData[]; byIdioma: PieData[]
}) {
  const router = useRouter()

  function handleEstadoClick(entry: PieData) {
    if (entry.estado) router.push(`/leads?estado=${entry.estado}`)
  }

  function handleIdiomaClick(entry: PieData) {
    router.push(`/leads?idioma=${encodeURIComponent(entry.name)}`)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PieSection
        title="Oportunidades por estado"
        subtitle="Haz clic en un estado para filtrar"
        data={byEstado}
        onSliceClick={handleEstadoClick}
      />
      <PieSection
        title="Leads por idioma"
        subtitle="Haz clic en un idioma para filtrar"
        data={byIdioma}
        onSliceClick={handleIdiomaClick}
      />
    </div>
  )
}
