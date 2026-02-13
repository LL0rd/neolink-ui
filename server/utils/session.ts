import { randomBytes } from 'node:crypto'
import type { H3Event } from 'h3'

const SESSION_COOKIE = 'neolink-session'
const SESSION_TTL = 24 * 60 * 60 * 1000 // 24 hours

interface Session {
  token: string
  createdAt: number
}

/** In-memory token store (single-user app) */
const sessions = new Map<string, Session>()

function cleanExpired() {
  const now = Date.now()
  for (const [token, session] of sessions) {
    if (now - session.createdAt > SESSION_TTL) {
      sessions.delete(token)
    }
  }
}

export function isAuthRequired(): boolean {
  const config = useRuntimeConfig()
  return !!config.uiPassword
}

export function verifyPassword(password: string): boolean {
  const config = useRuntimeConfig()
  return config.uiPassword === password
}

export function createSession(event: H3Event): string {
  cleanExpired()
  const token = randomBytes(32).toString('hex')
  sessions.set(token, { token, createdAt: Date.now() })
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_TTL / 1000,
    path: '/',
  })
  return token
}

export function validateSession(event: H3Event): boolean {
  if (!isAuthRequired()) return true

  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return false

  const session = sessions.get(token)
  if (!session) return false

  if (Date.now() - session.createdAt > SESSION_TTL) {
    sessions.delete(token)
    return false
  }

  return true
}

export function destroySession(event: H3Event): void {
  const token = getCookie(event, SESSION_COOKIE)
  if (token) {
    sessions.delete(token)
  }
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}
