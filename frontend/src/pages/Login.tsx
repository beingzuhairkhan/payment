import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import type { ILogin } from '../types'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false)
    const { login, register: registerUser, loading } = useAuth()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ILogin>()

    const onSubmit = async (data:ILogin) => {
        if (isRegistering) {
            const result = await registerUser(data)
            if (result.success) {
                reset()
            }
        } else {
            const result = await login(data.email, data.password)
            if (result.success) {
                reset()
            }
        }
    }

    const toggleMode = () => {
        setIsRegistering(!isRegistering)
        reset()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="card">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
                            {isRegistering ? 'Create Account' : 'Sign In'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {isRegistering
                                ? 'Join the School Payment Dashboard'
                                : 'Welcome back to School Payment Dashboard'
                            }
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name field (only for registration) */}
                        {isRegistering && (
                            <div>
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter your full name"
                                    {...register('name', {
                                        required: isRegistering ? 'Name is required' : false,
                                        minLength: {
                                            value: 2,
                                            message: 'Name must be at least 2 characters'
                                        }
                                    })}
                                />
                                {errors.name && (
                                    <p className="form-error">{errors.name.message}</p>
                                )}
                            </div>
                        )}

                        {/* Email field */}
                        <div>
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                        message: 'Please enter a valid email address'
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="form-error">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password field */}
                        <div>
                            <label className="form-label">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input pr-10"
                                    placeholder="Enter your password"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="form-error">{errors.password.message}</p>
                            )}
                        </div>



                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary flex items-center justify-center"
                        >
                            {loading ? (
                                <LoadingSpinner size="sm" className="mr-2" />
                            ) : null}
                            {isRegistering ? 'Create Account' : 'Sign In'}
                        </button>
                    </form>

                    {/* Toggle between login and register */}
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
                        >
                            {isRegistering
                                ? 'Already have an account? Sign in'
                                : "Don't have an account? Sign up"
                            }
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login