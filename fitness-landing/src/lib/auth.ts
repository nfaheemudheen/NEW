import { apiUrl } from '@/lib/api'

export type StaffSession = {
  username: string
  name: string
  role: string
  token: string
  loginAt: string
  expiresAt: string
}

const SESSION_KEY = 'herspace.staff.session.v1'

function readSession(storage: Storage): StaffSession | null {
  try {
    const raw = storage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StaffSession>
    if (
      typeof parsed.username !== 'string' || typeof parsed.name !== 'string' ||
      typeof parsed.token !== 'string' || typeof parsed.expiresAt !== 'string'
    ) {
      storage.removeItem(SESSION_KEY)
      return null
    }
    if (Date.parse(parsed.expiresAt) <= Date.now()) {
      storage.removeItem(SESSION_KEY)
      return null
    }
    return {
      username: parsed.username,
      name: parsed.name,
      role: typeof parsed.role === 'string' ? parsed.role : 'Staff',
      token: parsed.token,
      loginAt: typeof parsed.loginAt === 'string' ? parsed.loginAt : new Date().toISOString(),
      expiresAt: parsed.expiresAt,
    }
  } catch {
    return null
  }
}

export function getStaffSession(): StaffSession | null {
  if (typeof window === 'undefined') return null
  return readSession(window.sessionStorage) ?? readSession(window.localStorage)
}

export async function loginStaff(
  username: string,
  password: string,
  remember: boolean,
): Promise<{ ok: true; session: StaffSession } | { ok: false; error: string }> {
  try {
    const response = await fetch(apiUrl('/api/staff/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok || typeof result.token !== 'string') {
      return { ok: false, error: result.error || 'Could not sign in. Check your credentials and API connection.' }
    }

    const session: StaffSession = {
      username: result.username,
      name: result.name || 'Studio Staff',
      role: result.role || 'Front desk',
      token: result.token,
      loginAt: new Date().toISOString(),
      expiresAt: result.expiresAt,
    }
    logoutStaff()
    const storage = remember ? window.localStorage : window.sessionStorage
    storage.setItem(SESSION_KEY, JSON.stringify(session))
    return { ok: true, session }
  } catch {
    return { ok: false, error: 'Could not reach the staff API. Check that the backend is running.' }
  }
}

export function logoutStaff(): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(SESSION_KEY)
    window.localStorage.removeItem(SESSION_KEY)
  } catch {
    // Ignore unavailable browser storage.
  }
}
