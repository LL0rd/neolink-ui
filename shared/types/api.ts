/** Standard API response wrapper */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/** Process status info */
export interface ProcessStatus {
  running: boolean
  pid?: number
  uptime?: number
  mode: string
  startedAt?: string
}

/** Session info returned by /api/auth/session */
export interface SessionInfo {
  authenticated: boolean
  authRequired: boolean
}

/** Login request body */
export interface LoginRequest {
  password: string
}
