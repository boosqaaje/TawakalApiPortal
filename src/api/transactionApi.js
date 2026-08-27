import axiosClient from './axiosClient'
import { PortalApiError } from './authApi'
import { getCommonResMessage, getCommonResPayload, isCommonResSuccess } from './commonRes'

const TRANSACTION_NOT_FOUND_CODE = 902

function isEmptyTransactionResult(body) {
  return body?.code === TRANSACTION_NOT_FOUND_CODE
}

export async function getPartnerTransactions() {
  try {
    const { data } = await axiosClient.get('/portal/partners/transactions')

    if (isCommonResSuccess(data)) {
      const payload = getCommonResPayload(data)
      return Array.isArray(payload) ? payload : []
    }

    if (isEmptyTransactionResult(data)) {
      return []
    }

    throw new PortalApiError(
      getCommonResMessage(data, 'Unable to load transactions.'),
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
      getCommonResMessage(data, 'Unable to load transactions. Please try again.'),
      data?.code,
      error.response?.status,
    )
  }
}
