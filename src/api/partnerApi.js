import axiosClient from './axiosClient'
import { PortalApiError } from './authApi'
import { getCommonResMessage, getCommonResPayload, isCommonResSuccess } from './commonRes'

export async function resetPartnerClientSecret() {
  try {
    const { data } = await axiosClient.get('/portal/partners/reset-secret')

    if (!isCommonResSuccess(data)) {
      throw new PortalApiError(
        getCommonResMessage(data, 'Unable to reset client secret.'),
        data?.code,
        200,
      )
    }

    const payload = getCommonResPayload(data)
    if (!payload?.clientSecret) {
      throw new PortalApiError('Reset did not return a client secret.', data?.code, 200)
    }

    return {
      partnerName: payload.partnerName || '',
      clientSecret: payload.clientSecret,
      message: getCommonResMessage(
        data,
        'Client secret rotated successfully. Save this secret immediately; it will not be shown again.',
      ),
    }
  } catch (error) {
    if (error instanceof PortalApiError) {
      throw error
    }

    const data = error.response?.data
    throw new PortalApiError(
      getCommonResMessage(data, 'Unable to reset client secret. Please try again.'),
      data?.code,
      error.response?.status,
    )
  }
}
