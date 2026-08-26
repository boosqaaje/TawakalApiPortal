import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {
  changePasswordPathForRole,
  homePathForRole,
  isChangePasswordPath,
  loginPathForLocation,
  rolesMatch,
} from '../auth/authStorage'
import { useAuth } from '../hooks/useAuth'

export function GuestRoute({ children }) {
  const { isAuthenticated, role, mustChangePassword } = useAuth()

  if (isAuthenticated) {
    if (mustChangePassword) {
      return <Navigate to={changePasswordPathForRole(role)} replace />
    }
    return <Navigate to={homePathForRole(role)} replace />
  }

  return children
}

export default function ProtectedRoute({ allowedRoles, allowPasswordChange = false }) {
  const { isAuthenticated, role, mustChangePassword } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to={loginPathForLocation(location.pathname)}
        replace
        state={{ from: location }}
      />
    )
  }

  if (mustChangePassword && !allowPasswordChange && !isChangePasswordPath(location.pathname)) {
    return <Navigate to={changePasswordPathForRole(role)} replace />
  }

  if (!mustChangePassword && allowPasswordChange) {
    return <Navigate to={homePathForRole(role)} replace />
  }

  if (allowedRoles?.length && !rolesMatch(role, allowedRoles)) {
    return <Navigate to={homePathForRole(role)} replace />
  }

  return <Outlet />
}
