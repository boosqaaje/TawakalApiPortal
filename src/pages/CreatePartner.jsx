import { useRef, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import axiosClient from '../api/axiosClient'
import { generateTemporaryPassword } from '../auth/password'
import { API_PATHS, MESSAGES } from '../constants'
import {
  preventPartnerUsernameSpaceInput,
  preventPartnerUsernameSpaceKeys,
  stripDoubleSpacePeriod,
} from '../auth/partnerUsername'
import GeneratedPasswordDialog from '../components/GeneratedPasswordDialog'

const emptyForm = {
  locationCode: '',
  partnerUsername: '',
  partnerEmail: '',
  partnerName: '',
}

const inputClassName =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function CreatePartner() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState(null)
  const lastUsernameSpaceAt = useRef(0)

  const markUsernameSpace = () => {
    lastUsernameSpaceAt.current = Date.now()
  }

  const updateField = (field) => (event) => {
    let value = event.target.value
    if (field === 'partnerUsername') {
      value = stripDoubleSpacePeriod(value, form.partnerUsername, lastUsernameSpaceAt.current)
    } else if (field === 'locationCode') {
      value = value.toUpperCase()
    }
    setForm((current) => ({ ...current, [field]: value }))
  }

  const validate = () => {
    const next = {}
    if (!form.locationCode.trim()) next.locationCode = 'Location code is required.'
    if (!form.partnerUsername.trim()) next.partnerUsername = 'Partner username is required.'
    else if (/\s/.test(form.partnerUsername)) next.partnerUsername = 'Spaces are not allowed in usernames.'
    if (!form.partnerEmail.trim()) {
      next.partnerEmail = 'Partner email is required.'
    } else if (!isValidEmail(form.partnerEmail.trim())) {
      next.partnerEmail = 'Enter a valid email address.'
    }
    if (!form.partnerName.trim()) next.partnerName = 'Partner name is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    const password = generateTemporaryPassword()
    setSubmitting(true)
    setErrors({})
    setCreated(null)

    try {
      const { data } = await axiosClient.post(API_PATHS.portalPartnersCreate, {
        locationCode: form.locationCode.trim(),
        partnerUsername: form.partnerUsername.trim(),
        password,
        partnerEmail: form.partnerEmail.trim(),
        partnerName: form.partnerName.trim(),
      })

      if (!data?.success) {
        setErrors({ form: data?.message || MESSAGES.unableToCreatePartner })
        return
      }

      const credentials = data.data ?? data.clientSecretRes
      setCreated({
        password,
        extraItems: [
          { label: 'Partner', value: credentials?.partnerName },
          { label: 'Client ID', value: credentials?.clientId, mustCopy: true },
          { label: 'Client Secret', value: credentials?.clientSecret, mustCopy: true },
        ],
      })
      setForm(emptyForm)
    } catch (error) {
      setErrors({
        form: error.response?.data?.message || MESSAGES.unableToCreatePartnerRetry,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold text-slate-900">Create Partner</h1>
      <p className="mt-1 text-sm text-slate-500">
        A temporary password is generated automatically. Copy it before closing the success dialog.
      </p>

      {errors.form && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="locationCode" className="mb-1.5 block text-sm font-medium text-slate-700">
            Location code
          </label>
          <input
            id="locationCode"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck="false"
            maxLength={45}
            value={form.locationCode}
            onChange={updateField('locationCode')}
            className={`${inputClassName} uppercase`}
          />
          {errors.locationCode && <p className="mt-1 text-xs text-red-600">{errors.locationCode}</p>}
        </div>
        <div>
          <label htmlFor="partnerUsername" className="mb-1.5 block text-sm font-medium text-slate-700">
            Partner username
          </label>
          <input
            id="partnerUsername"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck="false"
            value={form.partnerUsername}
            onChange={updateField('partnerUsername')}
            onKeyDown={(event) => preventPartnerUsernameSpaceKeys(event, markUsernameSpace)}
            onBeforeInput={(event) =>
              preventPartnerUsernameSpaceInput(event, markUsernameSpace, lastUsernameSpaceAt.current)
            }
            className={inputClassName}
          />
          <p className="mt-1 text-xs text-slate-500">Spaces are not allowed in usernames.</p>
          {errors.partnerUsername && <p className="mt-1 text-xs text-red-600">{errors.partnerUsername}</p>}
        </div>
        <div>
          <label htmlFor="partnerEmail" className="mb-1.5 block text-sm font-medium text-slate-700">
            Partner email
          </label>
          <input
            id="partnerEmail"
            type="email"
            autoComplete="off"
            value={form.partnerEmail}
            onChange={updateField('partnerEmail')}
            className={inputClassName}
          />
          {errors.partnerEmail && <p className="mt-1 text-xs text-red-600">{errors.partnerEmail}</p>}
        </div>
        <div>
          <label htmlFor="partnerName" className="mb-1.5 block text-sm font-medium text-slate-700">
            Partner name
          </label>
          <input
            id="partnerName"
            value={form.partnerName}
            onChange={updateField('partnerName')}
            className={inputClassName}
          />
          {errors.partnerName && <p className="mt-1 text-xs text-red-600">{errors.partnerName}</p>}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="btn-brand px-4 py-2.5 disabled:opacity-70"
        >
          {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
          Create partner
        </button>
      </form>

      {created && (
        <GeneratedPasswordDialog
          title="Partner created"
          message="Share this temporary password with the partner. They will be asked to change it on first login."
          password={created.password}
          extraItems={created.extraItems}
          onClose={() => setCreated(null)}
        />
      )}
    </div>
  )
}
