export type StaffSession = {
  username: string
  name: string
  role: string
  loginAt: string
  expiresAt: string
}

type StaffAccount = {
  username: string
  password: string
  name: string
  role: string
}

const SESSION_KEY = 'herspace.staff.session.v1'
const SESSION_TTL_MS = 12 * 60 * 60 * 1000
const REMEMBER_TTL_MS = 7 * 24 * 60 * 60 * 1000

const DEFAULT_USERNAME = (import.meta.env.VITE_STAFF_USERNAME || 'staff').trim().toLowerCase()
const DEFAULT_PASSWORD = import.meta.env.VITE_STAFF_PASSWORD || 'herspace2026'
const DEFAULT_NAME = import.meta.env.VITE_STAFF_NAME || 'Studio Staff'

/**
 * Demo staff account. Replace this with server-side authentication before
 * using the portal on a public production site.
 */
export const STAFF_ACCOUNTS: StaffAccount[] = [
  {
    username: DEFAULT_USERNAME,
    password: DEFAULT_PASSWORD,
    name: DEFAULT_NAME,
    role: 'Front desk',
  },
]

export const DEFAULT_STAFF_CREDENTIALS = {
  username: DEFAULT_USERNAME,
  password: DEFAULT_PASSWORD,
}

function readSession(storage: Storage): StaffSession | null {
  try {
    const raw = storage.getItem(SESSION_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<StaffSession>
    if (
      typeof parsed.username !== 'string' ||
      typeof parsed.name !== 'string' ||
      typeof parsed.expiresAt !== 'string'
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

export function loginStaff(
  username: string,
  password: string,
  remember: boolean,
): { ok: true; session: StaffSession } | { ok: false; error: string } {
  const normalizedUsername = username.trim().toLowerCase()
  const account = STAFF_ACCOUNTS.find(
    (candidate) =>
      candidate.username.toLowerCase() === normalizedUsername && candidate.password === password,
  )

  if (!account) {
    return { ok: false, error: 'Incorrect username or password. Please try again.' }
  }

  const now = Date.now()
  const session: StaffSession = {
    username: account.username,
    name: account.name,
    role: account.role,
    loginAt: new Date(now).toISOString(),
    expiresAt: new Date(now + (remember ? REMEMBER_TTL_MS : SESSION_TTL_MS)).toISOString(),
  }

  logoutStaff()

  try {
    const storage = remember ? window.localStorage : window.sessionStorage
    storage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    return {
      ok: false,
      error: 'Your browser blocked local storage. Allow storage to sign in.',
    }
  }

  return { ok: true, session }
}

export function logoutStaff(): void {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.removeItem(SESSION_KEY)
    window.localStorage.removeItem(SESSION_KEY)
  } catch {
    // Nothing else to clear.
  }
}
