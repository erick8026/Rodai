'use client'
import { useState } from 'react'

type Tenant = {
  id: string
  slug: string
  nombre: string
  plan: string
  activo: boolean
  created_at: string
}

const PLAN_COLORS: Record<string, string> = {
  basico: 'bg-gray-100 text-gray-700',
  pro: 'bg-blue-100 text-blue-700',
  premium: 'bg-purple-100 text-purple-700',
}

export default function TenantsClient({ initialTenants }: { initialTenants: Tenant[] }) {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    slug: '',
    nombre: '',
    plan: 'basico',
    email: '',
    password: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al crear tenant')

      setTenants(prev => [data.tenant, ...prev])
      setSuccess(`Cliente "${data.tenant.nombre}" creado. Email: ${form.email} / Pass: ${form.password}`)
      setForm({ slug: '', nombre: '', plan: 'basico', email: '', password: '' })
      setShowForm(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 text-sm mt-1">{tenants.length} tenants registrados</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(''); setSuccess('') }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
        >
          + Nuevo cliente
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Nuevo cliente</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del negocio</label>
                <input
                  name="nombre" value={form.nombre} onChange={handleChange} required
                  placeholder="Clínica Sosa"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (subdominio)</label>
                <input
                  name="slug" value={form.slug} onChange={handleChange} required
                  placeholder="clinica-sosa"
                  pattern="[a-z0-9\-]+"
                  title="Solo minúsculas, números y guiones"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {form.slug && (
                  <p className="text-xs text-gray-400 mt-1">{form.slug}.app.rodai.io</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <select
                  name="plan" value={form.plan} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="basico">Básico</option>
                  <option value="pro">Pro</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email del admin</label>
                <input
                  name="email" type="email" value={form.email} onChange={handleChange} required
                  placeholder="admin@clinicasosa.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña inicial</label>
                <input
                  name="password" type="text" value={form.password} onChange={handleChange} required
                  placeholder="Min. 8 caracteres"
                  minLength={8}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit" disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
                >
                  {loading ? 'Creando...' : 'Crear cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tenants table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Slug</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Plan</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Creado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tenants.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">No hay clientes aún</td>
              </tr>
            )}
            {tenants.map(t => (
              <tr key={t.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{t.nombre}</td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{t.slug}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${PLAN_COLORS[t.plan] ?? 'bg-gray-100 text-gray-700'}`}>
                    {t.plan}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {t.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {new Date(t.created_at).toLocaleDateString('es-CR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
