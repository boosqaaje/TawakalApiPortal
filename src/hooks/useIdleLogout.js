import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  isSessionIdle,
  loginPathForRole,
  markSessionActivity,
} from '../auth/authStorage'
import { useAuth } from './useAuth'

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click']
const ACTIVITY_THROTTLE_MS = 1000
const IDLE_CHECK_MS = 5000

export function useIdleLogout() {
  const { isAuthenticated, role, logout } = useAuth()
  const navigate = useNavigate()
  const loggingOut = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) {
      loggingOut.current = false
      return undefined
    }

    loggingOut.current = false
    markSessionActivity()
    let lastWrite = Date.now()

    const expireSession = () => {
      if (loggingOut.current) return
      loggingOut.current = true
      const loginPath = loginPathForRole(role)
      logout()
      navigate(loginPath, { replace: true })
    }

    const onActivity = () => {
      const now = Date.now()
      if (now - lastWrite < ACTIVITY_THROTTLE_MS) return
      lastWrite = now
      markSessionActivity()
    }

    const checkIdle = () => {
      if (isSessionIdle()) expireSession()
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkIdle()
    }

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, onActivity, { passive: true })
    })
    document.addEventListener('visibilitychange', onVisibilityChange)
    const intervalId = window.setInterval(checkIdle, IDLE_CHECK_MS)
    checkIdle()

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, onActivity)
      })
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.clearInterval(intervalId)
    }
  }, [isAuthenticated, role, logout, navigate])
}
