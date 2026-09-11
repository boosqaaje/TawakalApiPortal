import { useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import axiosClient from '../api/axiosClient'
import { generateTemporaryPassword } from '../auth/password'
import { API_PATHS, MESSAGES, ROLES } from '../constants'
import GeneratedPasswordDialog from '../components/GeneratedPasswordDialog'

const portalUserTypes = [
  { label: 'Admin', value: ROLES.admin },
  { label: 'User', value: ROLES.user },
]

const emptyForm = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  role: ROLES.user,
}

const inputClassName =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function CreateUser() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState('')

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const validate = () => {
    const next = {}
    if (!form.firstName.trim()) next.firstName = 'First name is required.'
    if (!form.lastName.trim()) next.lastName = 'Last name is required.'
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!isValidEmail(form.email.trim())) next.email = 'Enter a valid email address.'
    if (!form.role) next.role = 'Role is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    const password = generateTemporaryPassword()
    setSubmitting(true)
    setErrors({})
    setGeneratedPassword('')

    try {
      const { data } = await axiosClient.post(API_PATHS.portalUsersCreate, {
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password,
        role: form.role.trim().toUpperCase(),
      })

      if (!data?.success) {
        setErrors({ form: data?.message || MESSAGES.unableToCreateUser })
        return
      }

      setGeneratedPassword(password)
      setForm(emptyForm)
    } catch (error) {
      setErrors({
        form: error.response?.data?.message || MESSAGES.unableToCreateUserRetry,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold text-slate-900">Create User</h1>
      <p className="mt-1 text-sm text-slate-500">
        Add a portal user with Admin or User access. A temporary password is generated automatically.
      </p>

      {errors.form && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-slate-700">
              First name
            </label>
            <input
              id="firstName"
              value={form.firstName}
              onChange={updateField('firstName')}
              className={inputClassName}
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-slate-700">
              Last name
            </label>
            <input
              id="lastName"
              value={form.lastName}
              onChange={updateField('lastName')}
              className={inputClassName}
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="middleName" className="mb-1.5 block text-sm font-medium text-slate-700">
            Middle name
          </label>
          <input
            id="middleName"
            value={form.middleName}
            onChange={updateField('middleName')}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={updateField('email')}
            className={inputClassName}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-slate-700">
            User type
          </label>
          <select
            id="role"
            value={form.role}
            onChange={updateField('role')}
            className={inputClassName}
          >
            {portalUserTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="btn-brand px-4 py-2.5 disabled:opacity-70"
        >
          {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
          Create user
        </button>
      </form>

      {generatedPassword && (
        <GeneratedPasswordDialog
          title="User created"
          message="Share this temporary password with the new user. They will be asked to change it on first login."
          password={generatedPassword}
          onClose={() => setGeneratedPassword('')}
        />
      )}
    </div>
  )
}
