import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { getSession } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import Sidebar from '@/components/Sidebar'
import TenantsClient from './TenantsClient'

export const dynamic = 'force-dynamic'

export default async function AdminTenantsPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.tenantSlug !== 'rodai' || session.rol !== 'owner') redirect('/dashboard')

  noStore()

  let tenants: any[] = []
  try {
    const sb = getSupabaseAdmin()
    if (sb) {
      const { data } = await sb.from('tenants').select('*').order('created_at', { ascending: false })
      tenants = data ?? []
    }
  } catch (_) {}

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={true} />
      <main className="flex-1 p-8 overflow-auto">
        <TenantsClient initialTenants={tenants} />
      </main>
    </div>
  )
}
