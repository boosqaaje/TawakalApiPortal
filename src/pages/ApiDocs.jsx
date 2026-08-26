const endpoints = [
  {
    method: 'POST',
    path: '/partner/auth/token',
    detail: 'Exchange client_id and client_secret for a partner JWT. Use grant_type=client_credentials.',
  },
  {
    method: 'POST',
    path: '/transaction/send',
    detail: 'Submit a new transfer. Requires a partner Bearer token.',
  },
  {
    method: 'GET',
    path: '/transaction/status/{reference}',
    detail: 'Look up the current status of a transfer by reference.',
  },
  {
    method: 'GET',
    path: '/transaction/cancel/{reference}',
    detail: 'Cancel a transfer when the current status allows it.',
  },
]

export default function ApiDocs() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-slate-900">API Documentation</h1>
      <p className="mt-1 text-sm text-slate-500">
        Partner-facing endpoints used with client credentials issued from this portal.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {endpoints.map((endpoint) => (
          <article key={endpoint.path} className="border-b border-slate-200 p-5 last:border-b-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700">
                {endpoint.method}
              </span>
              <code className="text-sm text-slate-800">{endpoint.path}</code>
            </div>
            <p className="mt-2 text-sm text-slate-500">{endpoint.detail}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
