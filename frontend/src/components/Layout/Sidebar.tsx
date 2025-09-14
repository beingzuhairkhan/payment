import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  XMarkIcon, 
  HomeIcon, 
  CreditCardIcon, 
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Schools', href: '/schools', icon: AcademicCapIcon },
  { name: 'All Transactions', href: '/transactions', icon: CreditCardIcon },
  { name: 'School Transactions', href: '/school-transactions', icon: BuildingOfficeIcon },
  { name: 'Transaction Status', href: '/transaction-status', icon: MagnifyingGlassIcon },
  { name: 'Create Payment', href: '/create-payment', icon: PlusCircleIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { user, logout } = useAuth()

  const isCurrentPath = (path) => {
    return location.pathname === path
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between h-16 px-6 bg-primary-600 dark:bg-primary-700">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-white" />
              <span className="ml-2 text-lg font-semibold text-white">
                School Pay
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 bg-primary-50 dark:bg-gray-750 border-b border-primary-100 dark:border-gray-700">
            <div className="text-sm font-medium text-primary-900 dark:text-black">
              {user?.name}
            </div>
            <div className="text-sm dark:text-black text-primary-600 dark:text-primary-300">
              {user?.email}
            </div>
          
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const current = isCurrentPath(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => onClose()}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${current 
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 ${
                      current 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Logout button */}
          <div className="px-4 pb-4">
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar