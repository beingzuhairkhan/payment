import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { 
  UserIcon,
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'

const Settings = () => {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme() as {
  theme: string
  setTheme: (theme: string) => void
  systemTheme?: string
}

  const handleThemeChange = (newTheme:'light' | 'dark' | 'system') => {
    setTheme(newTheme)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account and application preferences
        </p>
      </div>

      {/* Profile Settings */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Information
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={user?.name || ''}
                readOnly
              />
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                readOnly
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="form-label">User ID</label>
              <input
                type="text"
                className="form-input"
                value={user?._id || ''}
                readOnly
              />
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Profile information is read-only. Contact your administrator to make changes.
            </p>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center">
            <MoonIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Appearance
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Theme Preference</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={() => handleThemeChange('light')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <SunIcon className="h-5 w-5 ml-2 mr-3 text-yellow-500" />
                <div>
                  <div className="font-medium">Light</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Bright and clean interface
                  </div>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={() => handleThemeChange('dark')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <MoonIcon className="h-5 w-5 ml-2 mr-3 text-blue-500" />
                <div>
                  <div className="font-medium">Dark</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Easy on the eyes
                  </div>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="theme"
                  value="system"
                  checked={false}
                  onChange={() => handleThemeChange('system')}
                  className="text-primary-600 focus:ring-primary-500"
                  disabled
                />
                <ComputerDesktopIcon className="h-5 w-5 ml-2 mr-3 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-400">System</div>
                  <div className="text-sm text-gray-400">
                    Coming soon
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Settings