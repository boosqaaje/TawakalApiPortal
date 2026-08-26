import axiosClient from './axiosClient'
import { sessionFromToken } from '../auth/authStorage'
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
          ? 'Login did not return a valid session.'
          : getCommonResMessage(data, 'Login did not return a valid session.'),
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
    const fallback = error.response
      ? 'Something went wrong. Please try again.'
      : 'Unable to reach the API at http://localhost:5278.'

    throw new PortalApiError(
      getCommonResMessage(data, fallback),
      data?.code,
      error.response?.status,
    )
  }
}

export function loginPortalUser({ email, password }) {
  return completePortalLogin(
    axiosClient.post('/portal/users/login', {
      email,
      password,
    }),
  )
}

export function loginPortalPartner({ username, password }) {
  return completePortalLogin(
    axiosClient.post('/portal/partners/login', {
      username,
      password,
    }),
  )
}

export async function resetPortalPassword({ userType, userId, newPassword }) {
  try {
    const { data } = await axiosClient.post('/portal/reset-password', {
      userType: (userType ?? '').trim().toUpperCase(),
      userId: (userId ?? '').trim(),
      newPassword,
    })

    if (!isCommonResSuccess(data)) {
      throw new PortalApiError(
        getCommonResMessage(data, 'Unable to reset password.'),
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
      getCommonResMessage(data, 'Unable to reset password. Please try again.'),
      data?.code,
      error.response?.status,
    )
  }
}

export async function changePortalPassword({ currentPassword, newPassword }) {
  try {
    const { data } = await axiosClient.post('/portal/change-password', {
      currentPassword,
      newPassword,
    })

    if (!isCommonResSuccess(data)) {
      throw new PortalApiError(
        getCommonResMessage(data, 'Unable to change password.'),
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
      getCommonResMessage(data, 'Unable to change password. Please try again.'),
      data?.code,
      error.response?.status,
    )
  }
}
