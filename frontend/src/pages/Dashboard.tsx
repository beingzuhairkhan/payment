import React from 'react'
import { useQuery } from 'react-query'
import { 
  CurrencyDollarIcon, 
  CreditCardIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/solid'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { transactionAPI } from '../services/api'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import Transactions from './Transactions';
import { data } from 'react-router-dom'

const Dashboard = () => {
  const { data, isLoading: statsLoading } = useQuery(
    'transaction-stats',
    () => transactionAPI.getTransactionStats(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  )


  console.log("Response" , data?.data?.data)

  const stats = data?.data?.data || {}


  const statCards = [
    {
      title: 'Total Transactions',
      value: stats.totalTransaction || 0,
      icon: CreditCardIcon,
      color: 'primary',
    },
    {
      title: 'Total Amount',
      value: `₹${(stats.totalAmount || 0).toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'secondary',
    },
    {
      title: 'Successful',
      value: stats.totalSuccessful || 0,
      icon: CheckCircleIcon,
      color: 'success',
    },
    {
      title: 'Pending',
      value: stats.totalPending || 0,
      icon: ClockIcon,
      color: 'pending',

    },
    {
      title: 'Failed',
      value: stats.totalFailed || 0,
      icon: XCircleIcon,
      color: 'error',
    }
  ]

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'success':
        return 'status-badge status-success'
      case 'failed':
        return 'status-badge status-failed'
      case 'pending':
        return 'status-badge status-pending'
      default:
        return 'status-badge status-cancelled'
    }
  }

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your school payment transactions and performance
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <ClockIcon className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses = {
            primary: 'bg-primary-500 text-white',
            secondary: 'bg-secondary-500 text-white',
            success: 'bg-success-500 text-white',
            pending: 'bg-pending-500 text-white pen',
            error: 'bg-error-500 text-white'
          }

          return (
            <div key={index} className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

     

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <CreditCardIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Create Payment
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Generate a new payment request for students
            </p>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Check Status
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Track the status of payment transactions
            </p>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-gray-100/85 dark:bg-white rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon scale={40} className="h-6 w-6 text-accent-600 dark:text-accent-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              View Transactions
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Access detailed transaction reports
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard