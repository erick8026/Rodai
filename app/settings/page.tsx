'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import UsersManager from '@/components/UsersManager'
import ProductosManager from '@/components/ProductosManager'

export default function SettingsPage() {
  const [tab, setTab] = useState<'usuarios' | 'productos'>('usuarios')

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-500 text-sm mt-1">Usuarios y catálogo de productos</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
          <button
            onClick={() => setTab('usuarios')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'usuarios' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Usuarios
          </button>
          <button
            onClick={() => setTab('productos')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'productos' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Catálogo de Productos
          </button>
        </div>

        {tab === 'usuarios' ? <UsersManager /> : <ProductosManager />}
      </main>
    </div>
  )
}
