import axiosClient from './axiosClient'
import { sessionFromToken } from '../auth/authStorage'
import { API_PATHS, MESSAGES } from '../constants'
import { getCommonResMessage, getCommonResPayload, isCommonResSuccess } from './commonRes'

export class PortalApiError extends Error {
  constructor(message, code, status) {
    super(message)
    this.name = 'PortalApiError'
    this.code = code ?? null
    this.status = status ?? null
  }
}

async function completePortalLogin(request) {
  try {
    const { data } = await request
    const payload = getCommonResPayload(data)
    const session = sessionFromToken(payload?.token)

    if (!isCommonResSuccess(data) || !session) {
      throw new PortalApiError(
        isCommonResSuccess(data)
          ? MESSAGES.loginInvalidSession
          : getCommonResMessage(data, MESSAGES.loginInvalidSession),
        data?.code,
        200,
      )
    }

    return {
      ...session,
      mustChangePassword: payload?.mustChangePassword === true,
    }
  } catch (error) {
    if (error instanceof PortalApiError) {
      throw error
    }

    const data = error.response?.data
    const fallback = error.response ? MESSAGES.genericError : MESSAGES.apiUnreachable()

    throw new PortalApiError(
      getCommonResMessage(data, fallback),
      data?.code,
      error.response?.status,
    )
  }
}

export function loginPortalUser({ email, password }) {
  return completePortalLogin(
    axiosClient.post(API_PATHS.portalUserLogin, {
      email,
      password,
    }),
  )
}

export function loginPortalPartner({ username, password }) {
  return completePortalLogin(
    axiosClient.post(API_PATHS.portalPartnerLogin, {
      username,
      password,
    }),
  )
}

export async function resetPortalPassword({ userType, userId, newPassword }) {
  try {
    const { data } = await axiosClient.post(API_PATHS.portalResetPassword, {
      userType: (userType ?? '').trim().toUpperCase(),
      userId: (userId ?? '').trim(),
      newPassword,
    })

    if (!isCommonResSuccess(data)) {
      throw new PortalApiError(
        getCommonResMessage(data, MESSAGES.unableToResetPassword),
        data?.code,
        200,
      )
    }

    return getCommonResMessage(data, 'Password resetted successfully.')
  } catch (error) {
    if (error instanceof PortalApiError) {
      throw error
    }

    const data = error.response?.data
    throw new PortalApiError(
      getCommonResMessage(data, MESSAGES.unableToResetPasswordRetry),
      data?.code,
      error.response?.status,
    )
  }
}

export async function changePortalPassword({ currentPassword, newPassword }) {
  try {
    const { data } = await axiosClient.post(API_PATHS.portalChangePassword, {
      currentPassword,
      newPassword,
    })

    if (!isCommonResSuccess(data)) {
      throw new PortalApiError(
        getCommonResMessage(data, MESSAGES.unableToChangePassword),
        data?.code,
        200,
      )
    }

    return getCommonResMessage(data, 'Password successfully changed')
  } catch (error) {
    if (error instanceof PortalApiError) {
      throw error
    }

    const data = error.response?.data
    throw new PortalApiError(
      getCommonResMessage(data, MESSAGES.unableToChangePasswordRetry),
      data?.code,
      error.response?.status,
    )
  }
}
