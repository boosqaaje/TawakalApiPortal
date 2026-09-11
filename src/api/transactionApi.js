import axiosClient from './axiosClient'
import { PortalApiError } from './authApi'
import { API_PATHS, MESSAGES, TRANSACTION_NOT_FOUND_CODE } from '../constants'
import { getCommonResMessage, getCommonResPayload, isCommonResSuccess } from './commonRes'

function isEmptyTransactionResult(body) {
  return body?.code === TRANSACTION_NOT_FOUND_CODE
}

export async function getPartnerTransactions() {
  try {
    const { data } = await axiosClient.get(API_PATHS.portalPartnersTransactions)

    if (isCommonResSuccess(data)) {
      const payload = getCommonResPayload(data)
      return Array.isArray(payload) ? payload : []
    }

    if (isEmptyTransactionResult(data)) {
      return []
    }

    throw new PortalApiError(
      getCommonResMessage(data, MESSAGES.unableToLoadTransactions),
      data?.code,
      200,
    )
  } catch (error) {
    if (error instanceof PortalApiError) {
      throw error
    }

    const data = error.response?.data
    if (isEmptyTransactionResult(data) || error.response?.status === 404) {
      return []
    }

    throw new PortalApiError(
      getCommonResMessage(data, MESSAGES.unableToLoadTransactionsRetry),
      data?.code,
      error.response?.status,
    )
  }
}
