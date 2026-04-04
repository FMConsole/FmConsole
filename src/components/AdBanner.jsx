import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import C from '../theme/colors'
import { AD_CLIENT } from '../config/ads'

export default function AdBanner({ slot, format = 'auto', responsive = true, style: sx }) {
  const { pathname } = useLocation()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      hasRun.current = true
    } catch (e) {
      // AdSense not loaded (e.g. localhost or blocked)
    }
    return () => { hasRun.current = false }
  }, [pathname])

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: 16,
      textAlign: 'center',
      overflow: 'hidden',
      ...sx,
    }}>
      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8, fontWeight: 500 }}>
        Advertisement
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}
