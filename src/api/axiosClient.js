import axios from 'axios'
import { clearAuth, getStoredAuth } from '../auth/authStorage'

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5278').replace(
  /\/+$/,
  '',
)

const axiosClient = axios.create({
  baseURL: import.meta.env.DEV ? '' : configuredBaseUrl,
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
    const isAuthRequest =
      requestUrl.includes('/portal/users/login') ||
      requestUrl.includes('/portal/partners/login') ||
      requestUrl.includes('/portal/change-password') ||
      requestUrl.includes('/portal/reset-password')

    if (status === 401 && !isAuthRequest) {
      const loginPath = window.location.pathname.startsWith('/admin') ? '/admin/login' : '/login'
      clearAuth()
      if (window.location.pathname !== loginPath) {
        window.location.assign(loginPath)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosClient
