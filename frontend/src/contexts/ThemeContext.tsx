import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

const ThemeContext = createContext({})

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme')
        if (saved) {
            return saved === 'dark'
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    useEffect(() => {
        const root = window.document.documentElement

        if (isDark) {
            root.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            root.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [isDark])

    const toggleTheme = () => {
        setIsDark(!isDark)
    }

    const setTheme = (theme: 'light' | 'dark' | 'system') => {
        setIsDark(theme === 'dark')
    }

    const value = {
        isDark,
        toggleTheme,
        setTheme,
        theme: isDark ? 'dark' : 'light'
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )

}