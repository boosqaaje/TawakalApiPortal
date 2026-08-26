import { LayoutDashboard, UserPlus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const actions = [
  {
    to: '/admin/partners/create',
    title: 'Create Partner',
    description: 'Provision a new partner and issue API credentials.',
    icon: Users,
  },
  {
    to: '/admin/users/create',
    title: 'Create User',
    description: 'Add an Admin or Partner portal user.',
    icon: UserPlus,
  },
]

export default function AdminDashboard() {
  const { displayName } = useAuth()

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-slate-500">
        Welcome back, {displayName}. Manage partners, portal users, and API access from here.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {actions.map(({ to, title, description, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-primary-300 hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="font-medium text-slate-900 group-hover:text-primary-700">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-slate-600">
          <LayoutDashboard className="h-4 w-4" />
          <h2 className="text-sm font-semibold uppercase tracking-wide">Operations</h2>
        </div>
        <p className="text-sm text-slate-500">
          Summary metrics will appear here once reporting endpoints are connected to the portal API.
        </p>
      </div>
    </div>
  )
}
