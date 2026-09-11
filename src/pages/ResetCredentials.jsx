import { useRef, useState } from 'react'
import { KeyRound, LoaderCircle } from 'lucide-react'
import { resetPortalPassword } from '../api/authApi'
import { generateTemporaryPassword } from '../auth/password'
import { MESSAGES, ROLES } from '../constants'
import {
  preventPartnerUsernameSpaceInput,
  preventPartnerUsernameSpaceKeys,
  stripDoubleSpacePeriod,
} from '../auth/partnerUsername'
import GeneratedPasswordDialog from '../components/GeneratedPasswordDialog'

const inputClassName =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function ResetCredentialsForm({
  title,
  description,
  identifierLabel,
  identifierKind,
  userType,
  dialogTitle,
  dialogMessage,
  extraItemLabel,
}) {
  const [identifier, setIdentifier] = useState('')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resetResult, setResetResult] = useState(null)
  const lastUsernameSpaceAt = useRef(0)
  const isUsername = identifierKind === 'username'

  const markUsernameSpace = () => {
    lastUsernameSpaceAt.current = Date.now()
  }

  const handleChange = (event) => {
    const value = isUsername
      ? stripDoubleSpacePeriod(event.target.value, identifier, lastUsernameSpaceAt.current)
      : event.target.value
    setIdentifier(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const userId = identifier.trim()

    if (!userId) {
      setError(`${identifierLabel} is required.`)
      setFormError('')
      return
    }

    if (identifierKind === 'email' && !isValidEmail(userId)) {
      setError('Enter a valid email address.')
      setFormError('')
      return
    }

    if (isUsername && /\s/.test(identifier)) {
      setError('Spaces are not allowed in usernames.')
      setFormError('')
      return
    }

    const newPassword = generateTemporaryPassword()
    setError('')
    setFormError('')
    setSubmitting(true)
    setResetResult(null)

    try {
      await resetPortalPassword({
        userType,
        userId,
        newPassword,
      })
      setResetResult({ password: newPassword, userId })
      setIdentifier('')
    } catch (submitError) {
      setFormError(submitError.message || MESSAGES.unableToResetPasswordRetry)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{description}</p>

      {formError && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor={`resetIdentifier-${userType}`} className="mb-1.5 block text-sm font-medium text-slate-700">
            {identifierLabel}
          </label>
          <input
            id={`resetIdentifier-${userType}`}
            type={identifierKind === 'email' ? 'email' : 'text'}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck="false"
            value={identifier}
            onChange={handleChange}
            onKeyDown={(event) => {
              if (isUsername) preventPartnerUsernameSpaceKeys(event, markUsernameSpace)
            }}
            onBeforeInput={(event) => {
              if (isUsername) {
                preventPartnerUsernameSpaceInput(event, markUsernameSpace, lastUsernameSpaceAt.current)
              }
            }}
            className={inputClassName}
          />
          {isUsername && <p className="mt-1 text-xs text-slate-500">Spaces are not allowed in usernames.</p>}
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="btn-brand px-4 py-2.5 disabled:opacity-70"
        >
          {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          Reset password
        </button>
      </form>

      {resetResult && (
        <GeneratedPasswordDialog
          title={dialogTitle}
          message={dialogMessage}
          password={resetResult.password}
          extraItems={[{ label: extraItemLabel, value: resetResult.userId }]}
          onClose={() => setResetResult(null)}
        />
      )}
    </div>
  )
}

export function ResetUserPassword() {
  return (
    <ResetCredentialsForm
      title="Reset User Password"
      description="Issue a new password for a portal user. Enter their email address."
      identifierLabel="User email"
      identifierKind="email"
      userType={ROLES.user}
      dialogTitle="User password reset"
      dialogMessage="Share this temporary password with the portal user. They will be asked to change it on next login."
      extraItemLabel="Email"
    />
  )
}

export function ResetPartnerPassword() {
  return (
    <ResetCredentialsForm
      title="Reset Partner Password"
      description="Issue a new password for a partner. Enter their partner username."
      identifierLabel="Partner username"
      identifierKind="username"
      userType={ROLES.partner}
      dialogTitle="Partner password reset"
      dialogMessage="Share this temporary password with the partner. They will be asked to change it on next login."
      extraItemLabel="Username"
    />
  )
}
