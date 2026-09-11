import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'

const COPY_FEEDBACK_MS = 2000

function formatFieldList(labels) {
  if (labels.length === 1) return labels[0]
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`
  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`
}

export default function GeneratedPasswordDialog({
  title,
  message,
  password,
  passwordLabel = 'Password',
  extraItems = [],
  onClose,
}) {
  const [confirmedFields, setConfirmedFields] = useState(() => new Set())
  const [justCopied, setJustCopied] = useState('')

  const copyValue = async (field, value) => {
    await navigator.clipboard.writeText(value)
    setConfirmedFields((current) => new Set(current).add(field))
    setJustCopied(field)
  }

  useEffect(() => {
    if (!justCopied) return undefined
    const timeoutId = window.setTimeout(() => setJustCopied(''), COPY_FEEDBACK_MS)
    return () => window.clearTimeout(timeoutId)
  }, [justCopied])

  const items = [
    ...(password ? [{ label: passwordLabel, value: password, mustCopy: true }] : []),
    ...extraItems.filter((item) => item.value),
  ]
  const requiredLabels = items.filter((item) => item.mustCopy).map((item) => item.label)
  const remainingLabels = requiredLabels.filter((label) => !confirmedFields.has(label))
  const allRequiredCopied = remainingLabels.length === 0
  const requiredList = formatFieldList(requiredLabels)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="generated-password-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="generated-password-title" className="text-lg font-semibold text-slate-900">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <p className="mt-2 text-sm font-medium text-amber-700">
          {requiredLabels.length === 1
            ? `Copy the ${requiredList} before you close this dialog. It will not be shown again.`
            : `Copy the ${requiredList} before you close this dialog. They will not be shown again.`}
        </p>

        <div className="mt-4 space-y-2">
          {items.map(({ label, value, mustCopy }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs"
            >
              <span className="shrink-0 text-slate-500">
                {label}
                {mustCopy && !confirmedFields.has(label) ? (
                  <span className="ml-1 font-sans text-[10px] font-medium text-amber-700">Required</span>
                ) : null}
              </span>
              <span className="truncate text-slate-900">{value}</span>
              <button
                type="button"
                onClick={() => copyValue(label, value)}
                className="shrink-0 text-slate-400 hover:text-slate-700"
                aria-label={`Copy ${label}`}
              >
                {justCopied === label ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={!allRequiredCopied}
          onClick={onClose}
          className="btn-brand mt-6 w-full px-4 py-2.5"
        >
          {allRequiredCopied ? 'Done' : `Copy ${formatFieldList(remainingLabels)} to continue`}
        </button>
      </div>
    </div>
  )
}
