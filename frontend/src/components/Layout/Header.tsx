import React from 'react'
import { Bars3Icon, SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import { useTheme } from '../../contexts/ThemeContext'

const Header = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Page title - hidden on mobile when menu button is shown */}
        <div className="hidden lg:block">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            School Payment Dashboard
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>

          
        </div>
      </div>
    </header>
  )
}

export default Header