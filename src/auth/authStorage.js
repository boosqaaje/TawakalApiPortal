const TOKEN_KEY = 'tawakal_token'
const ROLE_KEY = 'tawakal_role'
const EMAIL_KEY = 'tawakal_email'
const PARTNER_NAME_KEY = 'tawakal_partner_name'
const MUST_CHANGE_PASSWORD_KEY = 'tawakal_must_change_password'
const LAST_ACTIVITY_KEY = 'tawakal_last_activity'

export const IDLE_TIMEOUT_MS = 5 * 60 * 1000

export function getStoredAuth() {
  const token = localStorage.getItem(TOKEN_KEY)
  const role = localStorage.getItem(ROLE_KEY)
  const email = localStorage.getItem(EMAIL_KEY)
  const partnerName = localStorage.getItem(PARTNER_NAME_KEY)
  const mustChangePassword = localStorage.getItem(MUST_CHANGE_PASSWORD_KEY) === 'true'

  if (!token || !role) {
    return null
  }

  return {
    token,
    role,
    email: email ?? '',
    partnerName: partnerName || null,
    mustChangePassword,
  }
}

export function persistAuth({ token, role, email, partnerName, mustChangePassword }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(ROLE_KEY, role)
  localStorage.setItem(EMAIL_KEY, email ?? '')
  localStorage.setItem(MUST_CHANGE_PASSWORD_KEY, mustChangePassword ? 'true' : 'false')
  markSessionActivity()

  if (partnerName) {
    localStorage.setItem(PARTNER_NAME_KEY, partnerName)
  } else {
    localStorage.removeItem(PARTNER_NAME_KEY)
  }
}

export function markSessionActivity() {
  localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
}

export function getLastSessionActivity() {
  const value = Number(localStorage.getItem(LAST_ACTIVITY_KEY))
  return Number.isFinite(value) ? value : 0
}

export function isSessionIdle() {
  const lastActivity = getLastSessionActivity()
  if (!lastActivity) return true
  return Date.now() - lastActivity >= IDLE_TIMEOUT_MS
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ROLE_KEY)
  localStorage.removeItem(EMAIL_KEY)
  localStorage.removeItem(PARTNER_NAME_KEY)
  localStorage.removeItem(MUST_CHANGE_PASSWORD_KEY)
  localStorage.removeItem(LAST_ACTIVITY_KEY)
  sessionStorage.clear()
}

export function parseJwtPayload(token) {
  const parts = (token ?? '').split('.')
  if (parts.length < 2) return null

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

export function sessionFromToken(token) {
  const payload = parseJwtPayload(token)
  if (!payload) return null

  const role = payload.user_role || payload.role || ''
  const identifier = payload.user_id || payload.sub || payload.user_email || ''
  if (!role || !identifier) return null

  const partnerName = isPartnerRole(role)
    ? payload.partner_name || payload.partnerName || identifier
    : null

  return {
    token,
    role,
    email: identifier,
    partnerName,
    mustChangePassword: false,
  }
}

export function displayNameFromEmail(email) {
  if (!email) return 'User'
  const local = email.split('@')[0] ?? email
  return local
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function isPartnerRole(role) {
  return (role ?? '').toUpperCase() === 'PARTNER'
}

export function isPortalRole(role) {
  const value = (role ?? '').toUpperCase()
  return value === 'ADMIN' || value === 'USER'
}

export function isAdminRole(role) {
  return isPortalRole(role)
}

export function homePathForRole(role) {
  return isPortalRole(role) ? '/admin' : '/partner'
}

export function loginPathForRole(role) {
  return isPortalRole(role) ? '/admin/login' : '/login'
}

export function loginPathForLocation(pathname) {
  return (pathname ?? '').startsWith('/admin') ? '/admin/login' : '/login'
}

export function changePasswordPathForRole(role) {
  return isAdminRole(role) ? '/admin/change-password' : '/change-password'
}

export function isChangePasswordPath(pathname) {
  return pathname === '/change-password' || pathname === '/admin/change-password'
}

export function rolesMatch(role, allowedRoles) {
  const current = (role ?? '').toUpperCase()
  return allowedRoles.some((allowed) => allowed.toUpperCase() === current)
}
