import { useTheme } from '@/context/Theme'
import { Tooltip } from 'antd'
import './ThemeToggle.css'

// Premium Sun Icon SVG
const SunIcon = ({ className = '', style = {} }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <circle cx="12" cy="12" r="4.5" fill="currentColor" fillOpacity="0.2" />
    <path d="M12 2v2.5" />
    <path d="M12 19.5V22" />
    <path d="M4.93 4.93l1.77 1.77" />
    <path d="M17.3 17.3l1.77 1.77" />
    <path d="M2 12h2.5" />
    <path d="M19.5 12H22" />
    <path d="M4.93 19.07l1.77-1.77" />
    <path d="M17.3 6.7l1.77-1.77" />
  </svg>
)

// Premium Moon Icon SVG with Star Accent
const MoonIcon = ({ className = '', style = {} }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    <path d="M18.5 4.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" strokeWidth="0" fill="#60A5FA" />
  </svg>
)

const ThemeToggle = ({
  showLabel = false,
  variant = 'pill', // 'pill' | 'button'
  size = 'middle',
  className = '',
  style = {},
}) => {
  const { isDarkMode, toggleTheme } = useTheme()

  const tooltipTitle = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'
  const accessibleLabel = isDarkMode
    ? 'Dark theme active. Press to switch to Light mode'
    : 'Light theme active. Press to switch to Dark mode'

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleTheme()
    }
  }

  if (variant === 'pill') {
    return (
      <Tooltip title={tooltipTitle} placement="bottom">
        <div className="theme-toggle-wrapper">
          <button
            type="button"
            onClick={toggleTheme}
            onKeyDown={handleKeyDown}
            role="switch"
            aria-checked={isDarkMode}
            aria-label={accessibleLabel}
            className={`printopia-theme-toggle ${isDarkMode ? 'is-dark' : 'is-light'} ${className}`}
            style={style}
          >
            {/* Background Icons on Track */}
            <div className="theme-track-icons">
              <span className="track-icon sun" aria-hidden="true">
                <SunIcon />
              </span>
              <span className="track-icon moon" aria-hidden="true">
                <MoonIcon />
              </span>
            </div>

            {/* Dynamic Sliding Thumb */}
            <span className="theme-thumb">
              {isDarkMode ? (
                <MoonIcon className="thumb-svg moon" />
              ) : (
                <SunIcon className="thumb-svg sun" />
              )}
            </span>
          </button>

          {showLabel && (
            <span className="theme-toggle-label">
              {isDarkMode ? 'Dark' : 'Light'}
            </span>
          )}
        </div>
      </Tooltip>
    )
  }

  // Button variant
  return (
    <Tooltip title={tooltipTitle} placement="bottom">
      <button
        type="button"
        onClick={toggleTheme}
        onKeyDown={handleKeyDown}
        role="switch"
        aria-checked={isDarkMode}
        aria-label={accessibleLabel}
        className={`printopia-theme-btn ${isDarkMode ? 'dark-mode-btn' : 'light-mode-btn'} ${size} ${className}`}
        style={style}
      >
        <span style={{ display: 'inline-flex', width: 18, height: 18 }}>
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </span>
        <span className="theme-btn-text">
          {showLabel ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : (isDarkMode ? 'Light' : 'Dark')}
        </span>
      </button>
    </Tooltip>
  )
}

export default ThemeToggle
