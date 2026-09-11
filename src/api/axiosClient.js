import axios from 'axios'
import { clearAuth, getStoredAuth, loginPathForLocation } from '../auth/authStorage'
import { API_BASE_URL, AUTH_REQUEST_PATHS } from '../constants'

const axiosClient = axios.create({
  baseURL: import.meta.env.DEV ? '' : API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use((config) => {
  const auth = getStoredAuth()
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl = `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`
    const isAuthRequest = AUTH_REQUEST_PATHS.some((path) => requestUrl.includes(path))

    if (status === 401 && !isAuthRequest) {
      const loginPath = loginPathForLocation(window.location.pathname)
      clearAuth()
      if (window.location.pathname !== loginPath) {
        window.location.assign(loginPath)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosClient
