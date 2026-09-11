export const DEFAULT_API_BASE_URL = 'http://localhost:5278'

export function stripTrailingSlash(url) {
  return String(url ?? '').replace(/\/+$/, '')
}

export function getApiBaseUrl(envValue = import.meta.env?.VITE_API_BASE_URL) {
  return stripTrailingSlash(envValue || DEFAULT_API_BASE_URL)
}

export const API_BASE_URL = getApiBaseUrl()

export const API_PATHS = {
  portalUserLogin: '/portal/users/login',
  portalPartnerLogin: '/portal/partners/login',
  portalChangePassword: '/portal/change-password',
  portalResetPassword: '/portal/reset-password',
  portalUsersCreate: '/portal/users/create',
  portalPartnersCreate: '/portal/partners/create',
  portalPartnersResetSecret: '/portal/partners/reset-secret',
  portalPartnersTransactions: '/portal/partners/transactions',
  partnerDocs: '/partner/docs',
}

export const AUTH_REQUEST_PATHS = [
  API_PATHS.portalUserLogin,
  API_PATHS.portalPartnerLogin,
  API_PATHS.portalChangePassword,
  API_PATHS.portalResetPassword,
]

export const ROLES = {
  admin: 'ADMIN',
  user: 'USER',
  partner: 'PARTNER',
}

export const TRANSACTION_NOT_FOUND_CODE = 902

export const IDLE_TIMEOUT_MS = 5 * 60 * 1000

export const MESSAGES = {
  genericError: 'Something went wrong. Please try again.',
  apiUnreachable: (baseUrl = API_BASE_URL) => `Unable to reach the API at ${baseUrl}.`,
  loginInvalidSession: 'Login did not return a valid session.',
  unableToResetPassword: 'Unable to reset password.',
  unableToResetPasswordRetry: 'Unable to reset password. Please try again.',
  unableToChangePassword: 'Unable to change password.',
  unableToChangePasswordRetry: 'Unable to change password. Please try again.',
  unableToResetSecret: 'Unable to reset client secret.',
  unableToResetSecretRetry: 'Unable to reset client secret. Please try again.',
  unableToLoadTransactions: 'Unable to load transactions.',
  unableToLoadTransactionsRetry: 'Unable to load transactions. Please try again.',
  unableToCreatePartner: 'Unable to create partner.',
  unableToCreatePartnerRetry: 'Unable to create partner. Please try again.',
  unableToCreateUser: 'Unable to create user.',
  unableToCreateUserRetry: 'Unable to create user. Please try again.',
}
