import { useEffect, useState } from 'react'
import './PageLoader.css'

/**
 * PageLoader – Premium Animated Website Loading Screen for Printopia PK
 * 
 * Features:
 * - Full-screen dark background (#000000 / #050505) with radial glowing light
 * - Centered glowing Printopia PK emblem with electric blue & cyan gradient rings
 * - Shimmering linear progress runner
 * - Professional loading text: "Preparing Your Experience..."
 * - Smooth fade-in and fade-out transitions
 * - Safety watchdog timeout prevents infinite loading if network hangs
 * - Graceful exit timing prevents harsh UI flickering
 */
const PageLoader = ({
  isLoading = true,
  minDuration = 800,
  maxTimeout = 4000,
  onComplete,
}) => {
  const [visible, setVisible] = useState(true)
  const [fadingOut, setFadingOut] = useState(false)
  const [showFallback, setShowFallback] = useState(false)
  const [mountTime] = useState(() => Date.now())

  useEffect(() => {
    // If external loading finished, ensure minimum graceful duration before fade out
    if (!isLoading) {
      const elapsed = Date.now() - mountTime
      const remainingTime = Math.max(0, minDuration - elapsed)

      const timer = setTimeout(() => {
        setFadingOut(true)
        const exitTimer = setTimeout(() => {
          setVisible(false)
          if (onComplete) onComplete()
        }, 450) // Matches CSS transition duration
        return () => clearTimeout(exitTimer)
      }, remainingTime)

      return () => clearTimeout(timer)
    }
  }, [isLoading, minDuration, onComplete, mountTime])

  // Safety watchdog: After maxTimeout ms, show fallback or force finish to prevent stuck loader
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setShowFallback(true)
    }, 2800)

    const watchdogTimer = setTimeout(() => {
      setFadingOut(true)
      const exitTimer = setTimeout(() => {
        setVisible(false)
        if (onComplete) onComplete()
      }, 450)
      return () => clearTimeout(exitTimer)
    }, maxTimeout)

    return () => {
      clearTimeout(fallbackTimer)
      clearTimeout(watchdogTimer)
    }
  }, [maxTimeout, onComplete])

  if (!visible) return null

  return (
    <div
      className={`page-loader-overlay ${fadingOut ? 'fade-out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Printopia PK"
    >
      {/* Background ambient glowing radial aura */}
      <div className="page-loader-ambient" />

      {/* Center branded loading presentation */}
      <div className="page-loader-content">
        {/* Glowing Animated Emblem */}
        <div className="page-loader-emblem-wrap">
          <div className="page-loader-ring" />
          <div className="page-loader-ring-pulse" />
          <div className="page-loader-inner-badge">
            <span className="page-loader-monogram">P</span>
          </div>
        </div>

        {/* Brand Typography */}
        <h1 className="page-loader-brand-title">
          Printopia <span className="brand-accent">PK</span>
        </h1>
        <p className="page-loader-brand-subtitle">
          Bespoke Printing & Packaging
        </p>

        {/* Animated Progress Runner */}
        <div className="page-loader-progress-track">
          <div className="page-loader-progress-fill" />
        </div>

        {/* Professional Status Text */}
        <div className="page-loader-status-text">
          <span>Preparing Your Experience</span>
          <span className="page-loader-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>

        {/* Safety manual skip button if network is slow */}
        {showFallback && (
          <button
            type="button"
            className="page-loader-fallback-btn"
            onClick={() => {
              setFadingOut(true)
              setTimeout(() => {
                setVisible(false)
                if (onComplete) onComplete()
              }, 400)
            }}
          >
            Entering website...
          </button>
        )}
      </div>
    </div>
  )
}

export default PageLoader
