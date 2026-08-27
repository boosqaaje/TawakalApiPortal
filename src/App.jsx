import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute, { GuestRoute } from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import { useIdleLogout } from './hooks/useIdleLogout'
import { changePasswordPathForRole, homePathForRole, loginPathForLocation } from './auth/authStorage'
import PartnerLoginPage from './pages/PartnerLoginPage'
import AdminLoginPage from './pages/AdminLoginPage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import AdminDashboard from './pages/AdminDashboard'
import CreatePartner from './pages/CreatePartner'
import CreateUser from './pages/CreateUser'
import { ResetPartnerPassword, ResetUserPassword } from './pages/ResetCredentials'
import ApiDocs from './pages/ApiDocs'
import PartnerDashboard from './pages/PartnerDashboard'
import Transactions from './pages/Transactions'
import ResetSecret from './pages/ResetSecret'

function HomeRedirect() {
  const { isAuthenticated, role, mustChangePassword } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={loginPathForLocation(location.pathname)} replace />
  }

  if (mustChangePassword) {
    return <Navigate to={changePasswordPathForRole(role)} replace />
  }

  return <Navigate to={homePathForRole(role)} replace />
}

export default function App() {
  useIdleLogout()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <PartnerLoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/admin/login"
        element={
          <GuestRoute>
            <AdminLoginPage />
          </GuestRoute>
        }
      />

      <Route element={<ProtectedRoute allowPasswordChange />}>
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/admin/change-password" element={<ChangePasswordPage />} />
      </Route>

      <Route path="/admin">
        <Route element={<ProtectedRoute allowedRoles={['Admin', 'User']} />}>
          <Route element={<Layout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="partners/create" element={<CreatePartner />} />
            <Route path="users/create" element={<CreateUser />} />
            <Route path="users/reset-password" element={<ResetUserPassword />} />
            <Route path="partners/reset-password" element={<ResetPartnerPassword />} />
          </Route>
        </Route>
      </Route>

      <Route path="/partner">
        <Route element={<ProtectedRoute allowedRoles={['Partner']} />}>
          <Route element={<Layout />}>
            <Route index element={<PartnerDashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="reset-secret" element={<ResetSecret />} />
            <Route path="docs" element={<ApiDocs />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  )
}

