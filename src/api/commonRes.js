export function getCommonResPayload(body) {
  return body?.data ?? body?.portalAuthResponse ?? body?.clientSecretRes ?? null
}

export function getCommonResMessage(body, fallback) {
  return body?.message || fallback
}

export function isCommonResSuccess(body) {
  return body?.success === true
}
