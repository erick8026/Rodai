import { NextRequest, NextResponse } from 'next/server'
import { verifySession, COOKIE } from '@/lib/auth'

// Extrae el tenant slug del subdominio
// app.rodai.io         → "rodai"  (default)
// clinica.app.rodai.io → "clinica"
// lab-crm.vercel.app   → "rodai"  (fallback)
function getTenantSlug(req: NextRequest): string {
  const host = req.headers.get('host') ?? ''
  const parts = host.split('.')
  // Si hay más de 3 partes: subdominio.app.rodai.io
  if (parts.length >= 4 && parts[1] === 'app') {
    return parts[0]
  }
  return 'rodai'
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const tenantSlug = getTenantSlug(req)

  // Rutas públicas
  if (pathname === '/' || pathname.startsWith('/api/auth')) {
    const res = NextResponse.next()
    res.headers.set('x-tenant-slug', tenantSlug)
    return res
  }

  // n8n puede hacer POST a /api/leads con su API key (validado dentro del handler)
  if (pathname === '/api/leads' && req.method === 'POST') {
    const res = NextResponse.next()
    res.headers.set('x-tenant-slug', tenantSlug)
    return res
  }

  // Propuestas públicas (verificación por teléfono)
  if (pathname.startsWith('/propuesta/') || pathname.startsWith('/api/propuestas/')) {
    const res = NextResponse.next()
    res.headers.set('x-tenant-slug', tenantSlug)
    return res
  }

  const token = req.cookies.get(COOKIE)?.value
  if (!token) return NextResponse.redirect(new URL('/', req.url))

  const session = await verifySession(token)
  if (!session) return NextResponse.redirect(new URL('/', req.url))

  // Verificar que el tenant del session coincide con el subdominio
  const sessionTenant = (session as { tenantSlug?: string }).tenantSlug ?? 'rodai'
  if (sessionTenant !== tenantSlug) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const res = NextResponse.next()
  res.headers.set('x-tenant-slug', tenantSlug)
  res.headers.set('x-tenant-id', (session as { tenantId?: string }).tenantId ?? '')
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
