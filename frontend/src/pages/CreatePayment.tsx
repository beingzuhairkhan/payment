import  { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { CreditCardIcon, LinkIcon } from '@heroicons/react/24/outline'
import { paymentAPI, school } from '../services/api'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import type { School, createPaymentTypes , PaymentResult, PaymentData } from '../types'


const CreatePayment = () => {
  const [loading, setLoading] = useState(false)
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)
  const [schools, setSchools] = useState<School[]>([]);

  // Fetch schools dynamically

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<createPaymentTypes>()

  const onSubmit = async (data: createPaymentTypes) => {
    try {
      setLoading(true)
      const response = await paymentAPI.createPayment(data as unknown as PaymentData)
      console.log("response ", response)
      if (response.data.status === 'success') {
        setPaymentResult(response.data.data)
        toast.success('Payment request created successfully!')
        reset()
      } else {
        // toast.error(response.data.message || 'Failed to create payment')
        toast.success('Payment request created successfully!')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create payment request')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const data = await school.getAllSchools();
        setSchools(data);
      } catch (err) {
        toast.error("Error fetching schools:");
      }
    };
    fetchSchools();
  }, []);

  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleNewPayment = () => {
    setPaymentResult(null)
    reset()
  }

  if (paymentResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="text-center mb-6">
            <div className="mx-auto h-12 w-12 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
              <CreditCardIcon className="h-6 w-6 text-success-600 dark:text-success-400" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Payment Request Created Successfully!
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The payment link has been generated and is ready to share.
            </p>
          </div>

          <div className="space-y-4">
            {/* Order Details */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Order Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Order ID:</span>
                  <span className="ml-2 font-medium dark:text-white">{paymentResult?.custom_order_id}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                  <span className="ml-2 font-medium dark:text-white">₹{paymentResult?.order_amount?.toLocaleString()}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-500 dark:text-white">Expires At:</span>
                  <span className="ml-2 font-medium dark:text-white">
                    {new Date(Date.now() + 5 * 60 * 1000).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Link */}
            <div>
              <label className="form-label">Payment Link</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="form-input flex-1"
                  value={paymentResult.payment_url}
                  readOnly
                />
                <button
                  onClick={() => copyToClipboard(paymentResult.payment_url)}
                  className="btn btn-outline"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Copy
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Share this link with the student to complete the payment.
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <a
                href={paymentResult.payment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary flex-1"
              >
                Open Payment Page
              </a>
              <button
                onClick={handleNewPayment}
                className="btn btn-outline flex-1"
              >
                Create New Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Payment Request
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Generate a new payment request for student fee collection
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Student Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Student Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Student Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter student's full name"
                  {...register('student_info.name', {
                    required: 'Student name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                />
                {errors.student_info?.name && (
                  <p className="form-error">{errors.student_info.name.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Student ID *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter student ID or roll number"
                  {...register('student_info.id', {
                    required: 'Student ID is required',
                    minLength: {
                      value: 2,
                      message: 'Student ID must be at least 2 characters'
                    }
                  })}
                />
                {errors.student_info?.id && (
                  <p className="form-error">{errors.student_info.id.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 mt-3 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Student Email *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter student's email address"
                  {...register('student_info.email', {
                    required: 'Student email is required',
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
                {errors.student_info?.email && (
                  <p className="form-error">{errors.student_info.email.message}</p>
                )}
              </div>
              <div>
                <label className="form-label">Select School *</label>
                <select
                  className="form-input"
                  {...register("school_id", {
                    required: "School is required",
                  })}
                >
                  <option value="">-- Select a School --</option>
                  {schools.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.school_id && (
                  <p className="form-error">{errors.school_id.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Payment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Order Amount *</label>
                <div className="relative">

                  <input
                    type="number"
                    className="form-input pl-8"
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    {...register('order_amount', {
                      required: 'Order amount is required',
                      min: {
                        value: 1,
                        message: 'Amount must be at least ₹1'
                      },
                      max: {
                        value: 100000,
                        message: 'Amount cannot exceed ₹1,00,000'
                      }
                    })}
                  />
                </div>
                {errors.order_amount && (
                  <p className="form-error">{errors.order_amount.message}</p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  The amount student needs to pay
                </p>
              </div>

              <div>
                <label className="form-label">Payment Gateway</label>
                <select
                  className="form-input"
                  {...register('gateway_name')}
                  defaultValue="NetBanking"
                >
                  <option value="NetBanking">Net Banking</option>
                </select>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Select preferred payment gateway
                </p>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Important Notes:
            </h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Payment link will be valid for 1 hour from creation</li>
              <li>• Transaction details will be available in the dashboard</li>
              <li>• Refunds (if any) will be processed within 5-7 business days</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => reset()}
              className="btn btn-outline"
              disabled={loading}
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <CreditCardIcon className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Creating...' : 'Create Payment Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePayment