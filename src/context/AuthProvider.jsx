import { useMemo, useState } from 'react'
import {
  clearAuth,
  displayNameFromEmail,
  getStoredAuth,
  isPartnerRole,
  persistAuth,
} from '../auth/authStorage'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth())

  const value = useMemo(() => {
    const persistAndSet = (nextAuth) => {
      persistAuth(nextAuth)
      setAuth(nextAuth)
    }

    const login = ({ token, role, email, partnerName, mustChangePassword }) => {
      persistAndSet({
        token,
        role,
        email,
        partnerName: partnerName || null,
        mustChangePassword: Boolean(mustChangePassword),
      })
    }

    const completePasswordChange = () => {
      if (!auth) return
      persistAndSet({ ...auth, mustChangePassword: false })
    }

    const logout = () => {
      clearAuth()
      setAuth(null)
    }

    return {
      token: auth?.token ?? null,
      role: auth?.role ?? null,
      email: auth?.email ?? '',
      partnerName: isPartnerRole(auth?.role) ? auth?.partnerName || null : null,
      displayName: displayNameFromEmail(auth?.email),
      mustChangePassword: Boolean(auth?.mustChangePassword),
      isAuthenticated: Boolean(auth?.token),
      login,
      completePasswordChange,
      logout,
    }
  }, [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
