const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
const LOWER = 'abcdefghijkmnopqrstuvwxyz'
const DIGITS = '23456789'
const SPECIAL = '@#$%&*!'
const ALL = `${UPPER}${LOWER}${DIGITS}${SPECIAL}`

function randomChars(source, count) {
  const bytes = crypto.getRandomValues(new Uint32Array(count))
  return Array.from(bytes, (value) => source[value % source.length])
}

function shuffle(items) {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = crypto.getRandomValues(new Uint32Array(1))[0] % (index + 1)
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }
  return next
}

export function generateTemporaryPassword(length = 12) {
  const required = [
    ...randomChars(UPPER, 1),
    ...randomChars(LOWER, 1),
    ...randomChars(DIGITS, 1),
    ...randomChars(SPECIAL, 1),
  ]
  const rest = randomChars(ALL, Math.max(length - required.length, 0))
  return shuffle([...required, ...rest]).join('')
}

export const PASSWORD_POLICY_HINT =
  'Use at least 8 characters with an uppercase letter, a lowercase letter, a number, and a special character.'

export function getPasswordPolicyError(password) {
  if (!password) return 'Password is required.'
  if (password.length < 8) return 'Password must be at least 8 characters.'
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter.'
  if (!/\d/.test(password)) return 'Password must include a number.'
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must include a special character.'
  return ''
}
