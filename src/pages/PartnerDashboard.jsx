import { BookOpen, ListOrdered, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PartnerDashboard() {
  const { displayName } = useAuth()

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-slate-500">
        Welcome, {displayName}. Review transfers and rotate API credentials from this workspace.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          to="/partner/transactions"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-primary-300"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <ListOrdered className="h-5 w-5" />
          </div>
          <h2 className="font-medium text-slate-900">Transactions List</h2>
          <p className="mt-1 text-sm text-slate-500">Inspect recent transfers for this partner.</p>
        </Link>
        <Link
          to="/partner/reset-secret"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-primary-300"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <Shield className="h-5 w-5" />
          </div>
          <h2 className="font-medium text-slate-900">Reset Client Secret</h2>
          <p className="mt-1 text-sm text-slate-500">Rotate the API secret used by this partner.</p>
        </Link>
        <Link
          to="/partner/docs"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-primary-300"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="font-medium text-slate-900">API Documentation</h2>
          <p className="mt-1 text-sm text-slate-500">Review partner-facing API endpoints and usage.</p>
        </Link>
      </div>
    </div>
  )
}
