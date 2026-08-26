import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Building2,
  ChevronDown,
  KeyRound,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  Shield,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { isAdminRole, loginPathForRole } from '../auth/authStorage'
import { useAuth } from '../hooks/useAuth'

const adminNav = [
  { to: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/partners/create', label: 'Create Partner', icon: Users },
  { to: '/admin/users/create', label: 'Create User', icon: UserPlus },
  {
    label: 'Reset Credentials',
    icon: KeyRound,
    children: [
      { to: '/admin/users/reset-password', label: 'Reset User Password' },
      { to: '/admin/partners/reset-password', label: 'Reset Partner Password' },
    ],
  },
]

const partnerNav = [
  { to: '/partner', label: 'Dashboard Overview', icon: LayoutDashboard, end: true },
  { to: '/partner/transactions', label: 'Transactions List', icon: ListOrdered },
  { to: '/partner/reset-secret', label: 'Reset Client Secret', icon: Shield },
  { to: '/partner/docs', label: 'API Documentation', icon: BookOpen },
]

function navClassName({ isActive }) {
  return [
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary-600/15 text-primary-300 ring-1 ring-inset ring-primary-500/30'
      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white',
  ].join(' ')
}

function childNavClassName({ isActive }) {
  return [
    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary-600/15 text-primary-300 ring-1 ring-inset ring-primary-500/30'
      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white',
  ].join(' ')
}

function NavGroup({ item, onNavigate }) {
  const location = useLocation()
  const Icon = item.icon
  const childActive = item.children.some((child) => location.pathname === child.to)
  const [open, setOpen] = useState(childActive)

  useEffect(() => {
    if (childActive) setOpen(true)
  }, [childActive])

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={[
          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
          childActive
            ? 'bg-primary-600/10 text-primary-200'
            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white',
        ].join(' ')}
        aria-expanded={open}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1">{item.label}</span>
        <ChevronDown className={['h-4 w-4 shrink-0 transition-transform', open ? 'rotate-180' : ''].join(' ')} />
      </button>
      {open && (
        <div className="mt-1 ml-4 space-y-1 border-l border-slate-700 pl-3">
          {item.children.map((child) => (
            <NavLink key={child.to} to={child.to} className={childNavClassName} onClick={onNavigate}>
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Layout() {
  const { displayName, email, role, partnerName, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const items = isAdminRole(role) ? adminNav : partnerNav

  const handleLogout = () => {
    const loginPath = loginPathForRole(role)
    logout()
    navigate(loginPath, { replace: true })
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white shadow-lg shadow-primary-900/40">
          <Shield className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-wide text-white">Tawakal Portal</p>
          {partnerName ? (
            <p className="truncate text-xs font-medium text-cyan-300">{partnerName}</p>
          ) : (
            <p className="text-xs text-slate-400">Money transfer operations</p>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {items.map((item) =>
          item.children ? (
            <NavGroup key={item.label} item={item} onNavigate={() => setMobileOpen(false)} />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navClassName}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ),
        )}
      </nav>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-800 bg-slate-900 transition-transform lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <button
          type="button"
          className="absolute right-3 top-4 rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebar}
      </aside>

      <div className="min-h-screen bg-white text-slate-900 lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
          <button
            type="button"
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {partnerName ? (
            <div className="flex min-w-0 items-center gap-2">
              <Building2 className="h-4 w-4 shrink-0 text-cyan-600" />
              <p className="truncate text-sm font-semibold text-slate-900">{partnerName}</p>
            </div>
          ) : (
            <div className="hidden lg:block" />
          )}

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">{displayName}</p>
              <p className="text-xs text-slate-500">{email}</p>
            </div>
            <span
              className={[
                'rounded-full px-2.5 py-1 text-xs font-semibold',
                isAdminRole(role)
                  ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200'
                  : 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200',
              ].join(' ')}
            >
              {role}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <main className="bg-white p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
