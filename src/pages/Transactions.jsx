export default function Transactions() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold text-slate-900">Transactions List</h1>
      <p className="mt-1 text-sm text-slate-500">Recent transfers for the signed-in partner.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                No transactions to display yet. This list will bind to the portal transactions API.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
