import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Eye, EyeOff, LoaderCircle, Lock, Mail, Shield, User } from 'lucide-react'
import { loginPortalPartner, loginPortalUser } from '../api/authApi'
import { changePasswordPathForRole, homePathForRole } from '../auth/authStorage'
import {
  preventPartnerUsernameSpaceInput,
  preventPartnerUsernameSpaceKeys,
  stripDoubleSpacePeriod,
} from '../auth/partnerUsername'
import { useAuth } from '../hooks/useAuth'

const initialErrors = { identifier: '', password: '', form: '' }

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

const variants = {
  partner: {
    title: 'Partner Sign In',
    badge: 'Partner access',
    subtitle: 'This page is for Tawakal partners. Sign in with your partner username.',
    identifierLabel: 'Username',
    identifierPlaceholder: 'partner-username',
    identifierName: 'portal-username',
    submitLabel: 'Sign in as Partner',
    submittingLabel: 'Signing in…',
    documentTitle: 'Partner Login · Tawakal MTransfer',
    Icon: Building2,
    IdentifierIcon: User,
    accent: {
      iconWrap: 'bg-cyan-50 text-cyan-700',
      badge: 'bg-cyan-50 text-cyan-800 ring-cyan-200',
    },
  },
  admin: {
    title: 'Portal Admin Sign In',
    badge: 'Portal admin',
    subtitle: 'This page is for portal administrators. Sign in with your staff email.',
    identifierLabel: 'Email Address',
    identifierPlaceholder: 'name@company.com',
    identifierName: 'portal-email',
    submitLabel: 'Sign in as Admin',
    submittingLabel: 'Signing in…',
    documentTitle: 'Admin Login · Tawakal MTransfer',
    Icon: Shield,
    IdentifierIcon: Mail,
    accent: {
      iconWrap: 'bg-primary-50 text-primary-700',
      badge: 'bg-primary-50 text-primary-800 ring-primary-200',
    },
  },
}

const inputClassName =
  'w-full rounded-lg border border-transparent bg-slate-50 py-3 pl-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10'

export default function LoginForm({ variant }) {
  const isPartner = variant === 'partner'
  const copy = variants[isPartner ? 'partner' : 'admin']
  const { login } = useAuth()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const lastUsernameSpaceAt = useRef(0)

  const markUsernameSpace = () => {
    lastUsernameSpaceAt.current = Date.now()
  }
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState(initialErrors)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = copy.documentTitle
    return () => {
      document.title = 'Tawakal MTransfer'
    }
  }, [copy.documentTitle])

  const validate = () => {
    const next = { ...initialErrors }
    const trimmedIdentifier = identifier.trim()

    if (!trimmedIdentifier) {
      next.identifier = isPartner ? 'Username is required.' : 'Email is required.'
    } else if (isPartner && /\s/.test(identifier)) {
      next.identifier = 'Spaces are not allowed in usernames.'
    } else if (!isPartner && !isValidEmail(trimmedIdentifier)) {
      next.identifier = 'Enter a valid email address.'
    }

    if (!password) {
      next.password = 'Password is required.'
    }

    setErrors(next)
    return !next.identifier && !next.password
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setErrors(initialErrors)

    try {
      const auth = isPartner
        ? await loginPortalPartner({
            username: identifier.trim(),
            password,
          })
        : await loginPortalUser({
            email: identifier.trim(),
            password,
          })

      login(auth)
      navigate(
        auth.mustChangePassword
          ? changePasswordPathForRole(auth.role)
          : homePathForRole(auth.role),
        { replace: true },
      )
    } catch (error) {
      setErrors({
        ...initialErrors,
        form: error.message || 'Something went wrong. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const { Icon, IdentifierIcon } = copy

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#e8eef5] px-4 py-8 text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.95),transparent_48%),radial-gradient(circle_at_18%_82%,rgba(186,210,235,0.45),transparent_36%),radial-gradient(circle_at_88%_78%,rgba(196,214,236,0.5),transparent_38%)]" />

      <div className="relative z-10 w-full max-w-[440px] rounded-2xl bg-white px-8 py-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:px-10">
        <div className="mb-8 text-center">
          <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${copy.accent.iconWrap}`}>
            <Icon className="h-6 w-6" />
          </div>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ${copy.accent.badge}`}
          >
            {copy.badge}
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#071226]">{copy.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{copy.subtitle}</p>
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
            <label htmlFor="identifier" className="mb-1.5 block text-sm font-medium text-slate-700">
              {copy.identifierLabel}
            </label>
            <div className="relative">
              <IdentifierIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="identifier"
                name={copy.identifierName}
                type="text"
                inputMode={isPartner ? 'text' : 'email'}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                value={identifier}
                onChange={(event) =>
                  setIdentifier(
                    isPartner
                      ? stripDoubleSpacePeriod(event.target.value, identifier, lastUsernameSpaceAt.current)
                      : event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (isPartner) preventPartnerUsernameSpaceKeys(event, markUsernameSpace)
                }}
                onBeforeInput={(event) => {
                  if (isPartner) {
                    preventPartnerUsernameSpaceInput(event, markUsernameSpace, lastUsernameSpaceAt.current)
                  }
                }}
                className={inputClassName}
                placeholder={copy.identifierPlaceholder}
              />
            </div>
            {isPartner && (
              <p className="mt-1.5 text-xs text-slate-500">Spaces are not allowed in usernames.</p>
            )}
            {errors.identifier && <p className="mt-1.5 text-xs text-red-600">{errors.identifier}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="off"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={`${inputClassName} pr-11`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3.5 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword((open) => !open)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#050B1B] text-sm font-semibold text-white transition-colors hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {submitting ? copy.submittingLabel : copy.submitLabel}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <a href="mailto:support@tawakalmtransfer.com" className="font-semibold text-[#071226] hover:underline">
            Contact Support
          </a>
        </p>

        <p className="mt-8 flex items-center justify-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
          <Lock className="h-3 w-3" />
          Bank-grade encryption
        </p>
      </div>
    </div>
  )
}
