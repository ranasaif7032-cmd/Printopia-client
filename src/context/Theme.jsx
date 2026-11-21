import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme_mode') || localStorage.getItem('theme')
      if (saved === 'dark' || saved === 'light') return saved
      if (typeof window !== 'undefined' && window.matchMedia) {
        if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
      }
    } catch {
      // Fallback
    }
    // Default to Dark Mode as per Printopia design reference
    return 'dark'
  })

  useEffect(() => {
    try {
      localStorage.setItem('theme_mode', theme)
      localStorage.setItem('theme', theme)
    } catch {
      // ignore storage error
    }

    const root = document.documentElement
    const body = document.body

    root.setAttribute('data-theme', theme)
    root.style.colorScheme = theme
    body.setAttribute('data-theme', theme)

    if (theme === 'dark') {
      body.classList.add('dark-mode')
      body.classList.remove('light-mode')
    } else {
      body.classList.add('light-mode')
      body.classList.remove('dark-mode')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setThemeMode = (mode) => {
    if (mode === 'dark' || mode === 'light') {
      setTheme(mode)
    }
  }

  const isDarkMode = theme === 'dark'

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeProvider
