import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LoaderCircle, Lock } from 'lucide-react'
import SoftwayLogo from '../components/SoftwayLogo'
import { changePortalPassword } from '../api/authApi'
import { PASSWORD_POLICY_HINT, getPasswordPolicyError } from '../auth/password'
import { homePathForRole } from '../auth/authStorage'
import { MESSAGES } from '../constants'
import { useAuth } from '../hooks/useAuth'

const inputClassName =
  'w-full rounded-lg border border-transparent bg-slate-50 py-3 pl-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10'

const emptyErrors = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  form: '',
}

export default function ChangePasswordPage() {
  const { completePasswordChange, role } = useAuth()
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [errors, setErrors] = useState(emptyErrors)
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const next = { ...emptyErrors }
    if (!currentPassword) next.currentPassword = 'Current password is required.'
    next.newPassword = getPasswordPolicyError(newPassword)
    if (!next.newPassword && newPassword === currentPassword) {
      next.newPassword = 'New password must be different from the current password.'
    }
    if (!confirmPassword) {
      next.confirmPassword = 'Confirm the new password.'
    } else if (confirmPassword !== newPassword) {
      next.confirmPassword = 'Passwords do not match.'
    }

    setErrors(next)
    return !next.currentPassword && !next.newPassword && !next.confirmPassword
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setErrors(emptyErrors)

    try {
      await changePortalPassword({
        currentPassword,
        newPassword,
      })
      completePasswordChange()
      navigate(homePathForRole(role), { replace: true })
    } catch (error) {
      setErrors({
        ...emptyErrors,
        form: error.message || MESSAGES.unableToChangePasswordRetry,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f5f8] px-4 py-8 text-slate-900">
      <div className="w-full max-w-[440px] rounded-2xl bg-white px-8 py-10 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:px-10">
        <div className="mb-8 text-center">
          <div className="mb-5 flex justify-center">
            <SoftwayLogo />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Change password</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            You must set a new password before continuing. {PASSWORD_POLICY_HINT}
          </p>
        </div>

        {errors.form && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-5">
          <div>
            <label htmlFor="currentPassword" className="mb-1.5 block text-sm font-medium text-slate-700">
              Current password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className={`${inputClassName} pr-11`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3.5 text-slate-400 hover:text-slate-600"
                onClick={() => setShowCurrent((open) => !open)}
                aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
              >
                {showCurrent ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && <p className="mt-1.5 text-xs text-red-600">{errors.currentPassword}</p>}
          </div>

          <div>
            <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium text-slate-700">
              New password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="newPassword"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className={`${inputClassName} pr-11`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3.5 text-slate-400 hover:text-slate-600"
                onClick={() => setShowNew((open) => !open)}
                aria-label={showNew ? 'Hide new password' : 'Show new password'}
              >
                {showNew ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && <p className="mt-1.5 text-xs text-red-600">{errors.newPassword}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-700">
              Confirm new password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={inputClassName}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-brand h-12 w-full"
          >
            {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {submitting ? 'Saving…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
