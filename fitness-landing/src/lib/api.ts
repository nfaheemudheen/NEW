function normalizeApiBaseUrl(value: string | undefined) {
  const configured = (value ?? '').trim()
  if (!configured) return ''

  try {
    const url = new URL(configured)
    // Accept a copied Render health-check URL, but keep API calls rooted at the service.
    url.pathname = url.pathname.replace(/\/health.*$/i, '').replace(/\/$/, '')
    url.search = ''
    url.hash = ''
    return `${url.origin}${url.pathname}`
  } catch {
    return configured.replace(/\/health.*$/i, '').replace(/[?#].*$/, '').replace(/\/$/, '')
  }
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL)

export function apiUrl(path: string) {
  const base = API_BASE_URL.replace(/\/+$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
