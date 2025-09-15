import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { transactionAPI } from '../services/api'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import type { ITransactionStatus , TransactionStatus } from '../types'

const TransactionStatus = () => {
  const [searchOrderId, setSearchOrderId] = useState('')
  const [shouldSearch, setShouldSearch] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ITransactionStatus>()

  const { data, isLoading, error, refetch } = useQuery(
    ['transaction-status', searchOrderId],
    () => transactionAPI.getTransactionStatus(searchOrderId),
    {
      enabled: shouldSearch && !!searchOrderId,
      retry: false
    }
  )

  const onSubmit = (formData:ITransactionStatus) => {
    setSearchOrderId(formData.customOrderId.trim())
    setShouldSearch(true)
    refetch()
  }

  const transactionData = data?.data?.data
  // console.log("transactionData" , transactionData);

  const getStatusIcon = (status:TransactionStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-8 w-8 text-success-500" />
      case 'failed':
        return <XCircleIcon className="h-8 w-8 text-error-500" />
      case 'pending':
        return <ClockIcon className="h-8 w-8 text-warning-500" />
      default:
        return <InformationCircleIcon className="h-8 w-8 text-gray-500" />
    }
  }

  const getStatusBadgeClass = (status:TransactionStatus) => {
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

  const getStatusMessage = (status:TransactionStatus) => {
    switch (status) {
      case 'success':
        return 'Payment completed successfully'
      case 'failed':
        return 'Payment failed - please try again'
      case 'pending':
        return 'Payment is being processed'
      default:
        return 'Payment status unknown'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Check Transaction Status
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Enter your order ID to check the current payment status
        </p>
      </div>

      {/* Search Form */}
      <div className="card max-w-md mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Order ID</label>
            <div className="relative">
              <input
                type="text"
                className="form-input pl-10"
                placeholder="Enter your order ID (e.g., ORD_1234567890_abc)"
                {...register('customOrderId', {
                  required: 'Order ID is required',
                  minLength: {
                    value: 5,
                    message: 'Order ID must be at least 5 characters'
                  }
                })}
              />
            </div>
            {errors.customOrderId && (
              <p className="form-error">{errors.customOrderId.message}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              You can find your Order ID in the payment confirmation email or receipt
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary flex items-center justify-center"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Checking...' : 'Check Status'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {shouldSearch && (
        <div className="card">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <XCircleIcon className="mx-auto h-12 w-12 text-error-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                Transaction Not Found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {'The order ID you entered was not found in our system.'}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setShouldSearch(false)
                    setSearchOrderId('')
                  }}
                  className="btn btn-outline"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : transactionData ? (
            <div className="space-y-6">
              {/* Status Header */}
              <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-center mb-4">
                  {getStatusIcon(transactionData.status)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {getStatusMessage(transactionData.status)}
                </h2>
                <span className={getStatusBadgeClass(transactionData.status)}>
                  {transactionData.status?.toUpperCase()}
                </span>
                {transactionData.payment_message && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {transactionData.payment_message}
                  </p>
                )}
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 dark:text-white">
                {/* Order Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Order Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Order ID:</span>
                      <span className="font-medium text-primary-600 dark:text-primary-400">
                        {transactionData?.custom_order_id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Order Amount:</span>
                      <span className="font-medium">
                        ₹{transactionData.order_amount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Transaction Amount:</span>
                      <span className="font-medium">
                        ₹{transactionData.transaction_amount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Gateway:</span>
                      <span className="font-medium">{transactionData.gateway_name}</span>
                    </div>
                  </div>
                </div>

                {/* Student Information */}
                <div className='dark:text-white' >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Student Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Name:</span>
                      <span className="font-medium">{transactionData.student_info?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Student ID:</span>
                      <span className="font-medium">{transactionData.student_info?.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Email:</span>
                      <span className="font-medium">{transactionData.student_info?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">School ID:</span>
                      <span className="font-medium">{transactionData.school_id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className='dark:text-white' >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Payment Details
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Payment Mode:</span>
                      <p className="font-medium capitalize">{transactionData.payment_mode}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Payment Details:</span>
                      <p className="font-medium">{transactionData.payment_details}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Bank Reference:</span>
                      <p className="font-medium">{transactionData.bank_reference}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-500 dark:text-white mb-4">
                  Transaction Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium dark:text-gray-500">Order Created</p>
                      <p className="text-sm text-gray-500 dark:text-white">
                        Payment request was initiated
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-white">
                      {new Date(transactionData.created_at).toLocaleString()}
                    </span>
                  </div>

                  {transactionData.payment_time && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium dark:text-gray-500">Payment {transactionData.status === 'success' ? 'Completed' : 'Processed'}</p>
                        <p className="text-sm text-gray-500 dark:text-white">
                          {transactionData.payment_message}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-white">
                        {new Date(transactionData.payment_time).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {transactionData.status === 'failed' && transactionData.error_message !== 'NA' && (
                <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4">
                  <div className="flex">
                    <XCircleIcon className="h-5 w-5 text-error-400 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-error-800 dark:text-error-200">
                        Error Details
                      </h4>
                      <p className="text-sm text-error-700 dark:text-error-300 mt-1">
                        {transactionData.error_message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-center space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShouldSearch(false)
                    setSearchOrderId('')
                  }}
                  className="btn btn-outline"
                >
                  Check Another Order
                </button>

              </div>
            </div>
          ) : null}
        </div>
      )}

    </div>
  )
}

export default TransactionStatus