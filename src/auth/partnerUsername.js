const DOUBLE_SPACE_WINDOW_MS = 700

export function sanitizePartnerUsername(value) {
  return (value ?? '').replace(/\s/g, '')
}

export function stripDoubleSpacePeriod(nextValue, previousValue, lastSpaceAt) {
  const sanitized = sanitizePartnerUsername(nextValue)
  const insertedPeriod =
    Date.now() - lastSpaceAt < DOUBLE_SPACE_WINDOW_MS &&
    sanitized.length === previousValue.length + 1 &&
    sanitized.startsWith(previousValue) &&
    sanitized.endsWith('.')

  return insertedPeriod ? previousValue : sanitized
}

export function preventPartnerUsernameSpaceKeys(event, markSpace) {
  if (event.key === ' ' || event.code === 'Space') {
    event.preventDefault()
    markSpace()
  }
}

export function preventPartnerUsernameSpaceInput(event, markSpace, lastSpaceAt) {
  const data = event.data ?? ''
  if (/\s/.test(data)) {
    event.preventDefault()
    markSpace()
    return
  }

  if (data === '.' && Date.now() - lastSpaceAt < DOUBLE_SPACE_WINDOW_MS) {
    event.preventDefault()
  }
}
