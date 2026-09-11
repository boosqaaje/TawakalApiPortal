import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { getPartnerTransactions } from '../api/transactionApi'

function formatAmount(amount, currency) {
  const value = Number(amount)
  const code = (currency ?? '').toUpperCase()
  if (Number.isNaN(value)) {
    return [amount, code].filter(Boolean).join(' ')
  }

  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${code}`.trim()
}

function formatCreatedAt(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

function statusClassName(status) {
  const value = (status ?? '').toUpperCase()
  if (value === 'SUCCESS' || value === 'COMPLETED' || value === 'PAID' || value === 'ACTIVE') {
    return 'bg-[#dbf3e5] text-brand-green'
  }
  if (value === 'PENDING' || value === 'PROCESSING') {
    return 'bg-amber-50 text-amber-700'
  }
  if (value === 'FAILED' || value === 'CANCELLED' || value === 'CANCELED' || value === 'INACTIVE') {
    return 'bg-red-50 text-red-700'
  }
  return 'bg-slate-100 text-slate-600 ring-slate-200'
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const rows = await getPartnerTransactions()
        if (!cancelled) setTransactions(rows)
      } catch (loadError) {
        if (!cancelled) {
          setTransactions([])
          setError(loadError.message || 'Unable to load transactions. Please try again.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold text-slate-900">Transactions List</h1>
      <p className="mt-1 text-sm text-slate-500">Recent transfers for the signed-in partner.</p>

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-brand-navy text-white">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Reference</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Amount</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Service</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Loading transactions…
                  </span>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No transactions to display yet.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction.referenceId} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-mono text-xs text-slate-900">{transaction.referenceId}</td>
                  <td className="px-4 py-3 text-slate-900">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{transaction.serviceCode || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        'inline-flex rounded-full px-2 py-0.5 text-xs font-semibold',
                        statusClassName(transaction.status),
                      ].join(' ')}
                    >
                      {transaction.status || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatCreatedAt(transaction.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
