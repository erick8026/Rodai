'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lead, ESTADOS } from '@/lib/supabase'

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Lead>>({})
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const filtered = leads.filter(l => {
    const q = search.toLowerCase()
    const matchSearch = !q || [l.nombre, l.empresa, l.telefono, l.correo]
      .some(f => f?.toLowerCase().includes(q))
    const matchEstado = !filterEstado || l.estado === filterEstado
    return matchSearch && matchEstado
  })

  function startEdit(lead: Lead) {
    setEditId(lead.id)
    setEditData({ estado: lead.estado, notas: lead.notas, nombre: lead.nombre, empresa: lead.empresa, correo: lead.correo })
  }

  async function saveEdit(id: string) {
    setSaving(true)
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
    setSaving(false)
    setEditId(null)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre, empresa, teléfono..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterEstado}
          onChange={e => setFilterEstado(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          {Object.entries(ESTADOS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3 font-medium">Contacto</th>
              <th className="px-6 py-3 font-medium">Empresa</th>
              <th className="px-6 py-3 font-medium">Teléfono</th>
              <th className="px-6 py-3 font-medium">Fuente</th>
              <th className="px-6 py-3 font-medium">Idioma</th>
              <th className="px-6 py-3 font-medium">Estado</th>
              <th className="px-6 py-3 font-medium">Notas</th>
              <th className="px-6 py-3 font-medium">Fecha</th>
              <th className="px-6 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-10 text-center text-gray-400">No se encontraron resultados</td>
              </tr>
            )}
            {filtered.map(lead => (
              <tr key={lead.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  {editId === lead.id ? (
                    <input
                      className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm"
                      value={editData.nombre ?? ''}
                      onChange={e => setEditData(p => ({ ...p, nombre: e.target.value }))}
                    />
                  ) : (
                    <div>
                      <p className="font-medium text-gray-800">{lead.nombre || '—'}</p>
                      <p className="text-xs text-gray-400">{lead.correo || ''}</p>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {editId === lead.id ? (
                    <input
                      className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm"
                      value={editData.empresa ?? ''}
                      onChange={e => setEditData(p => ({ ...p, empresa: e.target.value }))}
                    />
                  ) : lead.empresa || '—'}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{lead.telefono || '—'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.fuente === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {lead.fuente ?? 'whatsapp'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 capitalize">{lead.idioma || '—'}</td>
                <td className="px-6 py-4">
                  {editId === lead.id ? (
                    <select
                      className="px-2 py-1 border border-gray-200 rounded-lg text-sm"
                      value={editData.estado ?? lead.estado}
                      onChange={e => setEditData(p => ({ ...p, estado: e.target.value as Lead['estado'] }))}
                    >
                      {Object.entries(ESTADOS).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: ESTADOS[lead.estado]?.color ?? '#6b7280' }}
                    >
                      {ESTADOS[lead.estado]?.label ?? lead.estado}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 max-w-xs">
                  {editId === lead.id ? (
                    <input
                      className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm"
                      value={editData.notas ?? ''}
                      onChange={e => setEditData(p => ({ ...p, notas: e.target.value }))}
                      placeholder="Agregar nota..."
                    />
                  ) : (
                    <span className="text-xs text-gray-500 truncate block max-w-[160px]">{lead.notas || '—'}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">{lead.fecha || '—'}</td>
                <td className="px-6 py-4">
                  {editId === lead.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(lead.id)}
                        disabled={saving}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 disabled:opacity-60"
                      >
                        {saving ? '...' : 'Guardar'}
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(lead)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 transition"
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
