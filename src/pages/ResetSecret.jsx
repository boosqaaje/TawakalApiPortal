import { useState } from 'react'
import { LoaderCircle, ShieldAlert } from 'lucide-react'
import { resetPartnerClientSecret } from '../api/partnerApi'
import { MESSAGES } from '../constants'
import GeneratedPasswordDialog from '../components/GeneratedPasswordDialog'

export default function ResetSecret() {
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [rotated, setRotated] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!confirmed) {
      setError('Confirm that you want to rotate the current client secret.')
      return
    }

    setSubmitting(true)
    setError('')
    setRotated(null)

    try {
      const result = await resetPartnerClientSecret()
      setRotated(result)
      setConfirmed(false)
    } catch (submitError) {
      setError(submitError.message || MESSAGES.unableToResetSecretRetry)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold text-slate-900">Reset Client Secret</h1>
      <p className="mt-1 text-sm text-slate-500">
        Rotating the secret invalidates the current credential. Save the new secret immediately.
      </p>

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

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
        <button type="submit" disabled={submitting} className="btn-brand px-4 py-2.5">
          {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
          Reset client secret
        </button>
      </form>

      {rotated && (
        <GeneratedPasswordDialog
          title="Client secret rotated"
          message={rotated.message}
          password={rotated.clientSecret}
          passwordLabel="Client Secret"
          extraItems={[{ label: 'Partner', value: rotated.partnerName }]}
          onClose={() => setRotated(null)}
        />
      )}
    </div>
  )
}
