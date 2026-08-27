import { useState } from 'react'
import { ShieldAlert } from 'lucide-react'

export default function ResetSecret() {
  const [confirmed, setConfirmed] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!confirmed) {
      setMessage('Confirm that you want to rotate the current client secret.')
      return
    }
    setMessage('Secret rotation is ready to connect once the portal API endpoint is available.')
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold text-slate-900">Reset Client Secret</h1>
      <p className="mt-1 text-sm text-slate-500">
        Rotating the secret invalidates the current credential after the overlap window.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          Save the new secret immediately. It will not be shown again.
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            className="rounded border-slate-300 bg-white text-primary-600 focus:ring-primary-500"
          />
          I understand this will issue a new client secret.
        </label>
        {message && <p className="text-sm text-slate-500">{message}</p>}
        <button
          type="submit"
          className="btn-brand px-4 py-2.5"
        >
          Reset client secret
        </button>
      </form>
    </div>
  )
}
