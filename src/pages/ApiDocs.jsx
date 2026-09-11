import { API_BASE_URL, API_PATHS } from '../constants'

export default function ApiDocs() {
  return (
    <div className="h-full min-h-0 w-full">
      <iframe
        src={`${API_BASE_URL}${API_PATHS.partnerDocs}`}
        className="h-full min-h-[calc(100vh-4rem)] w-full border-0"
        title="API Documentation"
      />
    </div>
  )
}
