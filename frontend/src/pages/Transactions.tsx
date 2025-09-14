import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import {
  FunnelIcon,
  ArrowsUpDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { MdOutlineContentCopy } from "react-icons/md";
import { transactionAPI } from '../services/api'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { toast } from 'react-hot-toast';

const Transactions = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 10,
    sort: searchParams.get('sort') || 'payment_time',
    order: searchParams.get('order') || 'desc',
    status: searchParams.getAll('status') || [],
    gateway: searchParams.getAll('gateway') || [],
    search: searchParams.get('search') || '',
    from_date: searchParams.get('from_date') || '',
    to_date: searchParams.get('to_date') || ''
  })

  const [showFilters, setShowFilters] = useState(false)

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => v && params.append(key, v))
      } else if (value) {
        params.set(key, value)
      }
    })

    setSearchParams(params)
  }, [filters, setSearchParams])

  const { data, isLoading, error } = useQuery(
    ['transactions', filters],
    () => transactionAPI.getTransactions(filters),
    {
      keepPreviousData: true,
      refetchInterval: 30000
    }
  )
  // console.log("Data", data)

  const transactions = data?.data?.data?.transactions || []
  // console.log("transactions", transactions)
  const pagination = data?.data?.pagination || {}

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset page when filtering
    }))
  }

  const handleMultiSelectChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
      page: 1
    }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sort: field,
      order: prev.sort === field && prev.order === 'asc' ? 'desc' : 'asc'
    }))
  }

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sort: 'payment_time',
      order: 'desc',
      status: [],
      gateway: [],
      search: '',
      from_date: '',
      to_date: ''
    })
  }

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

  const getSortIcon = (field) => {
    if (filters.sort !== field) return null
    return filters.order === 'asc' ? '↑' : '↓'
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 dark:text-red-400 mb-2">
          Error loading transactions
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {error.response?.data?.message || error.message}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Transactions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage all payment transactions
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-outline ${showFilters ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </button>

          {(filters.status.length > 0 || filters.gateway.length > 0 || filters.search || filters.from_date || filters.to_date) && (
            <button
              onClick={clearFilters}
              className="btn btn-ghost text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="form-label block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="form-input pl-10 w-full"
                  placeholder="Search orders, students..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>


            {/* Status Filter */}
            <div>
              <label className="form-label block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <div className="flex flex-wrap gap-3">
                {['success', 'pending', 'failed', 'cancelled'].map((status) => {
                  const colors: Record<string, string> = {
                    success: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:border-green-700 dark:text-green-300",
                    pending: "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300",
                    failed: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:border-red-700 dark:text-red-300",
                    cancelled: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300",
                  };

                  return (
                    <label
                      key={status}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border cursor-pointer transition ${colors[status]}`}
                    >
                      <input
                        type="checkbox"
                        className="rounded focus:ring-primary-500"
                        checked={filters.status.includes(status)}
                        onChange={() => handleMultiSelectChange("status", status)}
                      />
                      <span className="text-sm font-medium capitalize">{status}</span>
                    </label>
                  );
                })}
              </div>
            </div>


            {/* Gateway Filter */}
            <div>
              <label className="form-label block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Gateway
              </label>
              <div className="flex flex-wrap gap-3">
                {['PhonePe', 'Paytm', 'Razorpay', 'UPI'].map((gateway) => (
                  <label
                    key={gateway}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      className="rounded text-primary-600 focus:ring-primary-500"
                      checked={filters.gateway.includes(gateway)}
                      onChange={() => handleMultiSelectChange('gateway', gateway)}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {gateway}
                    </span>
                  </label>
                ))}
              </div>
            </div>


            {/* Date Range */}
            <div>
              <label className="form-label">Date Range</label>
              <div className="space-y-2">
                <input
                  type="date"
                  className="form-input"
                  placeholder="From date"
                  value={filters.from_date}
                  onChange={(e) => handleFilterChange('from_date', e.target.value)}
                />
                <input
                  type="date"
                  className="form-input"
                  placeholder="To date"
                  value={filters.to_date}
                  onChange={(e) => handleFilterChange('to_date', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          Showing {transactions.length} of {pagination.total_count || 0} transactions
        </span>
        <div className="flex items-center space-x-4">
          <select
            className="form-input text-sm py-1"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : transactions.length > 0 ? (
          <>
            <div className="overflow-x-auto p-0">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell responsive-hide-sm">SR.No</th>
                    <th className="table-header-cell responsive-hide-sm">Institute Name</th>
                    <th
                      className="table-header-cell cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort('custom_order_id')}
                    >
                      <div className="flex items-center">
                        Order ID
                        <ArrowsUpDownIcon className="ml-1 h-3 w-3" />
                        <span className="ml-1">{getSortIcon('custom_order_id')}</span>
                      </div>
                    </th>
                    <th className="table-header-cell">Student</th>
                    <th className="table-header-cell responsive-hide-sm">Payment Method</th>
                    <th
                      className="table-header-cell cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort('transaction_amount')}
                    >
                      <div className="flex items-center">
                        Order Amount
                        <ArrowsUpDownIcon className="ml-1 h-5 w-5" />
                        <span className="ml-1">{getSortIcon('transaction_amount')}</span>
                      </div>
                    </th>
                    <th
                      className="table-header-cell cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort('transaction_amount')}
                    >
                      <div className="flex items-center">
                        Transaction Amount
                        <ArrowsUpDownIcon className="ml-1 h-5 w-5" />
                        <span className="ml-1">{getSortIcon('transaction_amount')}</span>
                      </div>
                    </th>
                    <th
                      className="table-header-cell cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center space-x-1">
                        Status
                        <ArrowsUpDownIcon className="ml-1 h-3 w-3" />
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th
                      className="table-header-cell responsive-hide-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort('payment_time')}
                    >
                      <div className="flex items-center">
                        Payment Time
                        <ArrowsUpDownIcon className="ml-1 h-5 w-5" />
                        <span className="ml-1">{getSortIcon('payment_time')}</span>
                      </div>
                    </th>

                  </tr>
                </thead>
                <tbody className="table-body hover:scale">
                  {transactions.map((transaction, index) => (

                    <tr key={transaction.collect_id}
                      className="rounded-lg transition-all duration-200 hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md "
                    >
                      <td className="table-cell">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {index + 1}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {transaction.school_name}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span
                          className="font-medium text-gray-900 dark:text-white flex items-center space-x-1 cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(transaction.custom_order_id)
                            toast.success("Copied successfully!")
                          }}
                        >
                          {transaction.custom_order_id}
                          <MdOutlineContentCopy className=" ml-2 h-5 w-5 text-white" />
                        </span>
                      </td>
                      <td className="table-cell">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {transaction.student_info?.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.student_info?.email}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell responsive-hide-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {transaction.payment_mode}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div>
                          <div className="font-medium">
                            ₹{transaction.order_amount?.toLocaleString()}
                          </div>
                          {transaction.order_amount !== transaction.transaction_amount && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Base: ₹{transaction.order_amount?.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* transaction_amount */}
                      <td className="table-cell">
                        <div>
                          <div className="font-medium">
                            ₹{transaction.transaction_amount?.toLocaleString()}
                          </div>
                          {transaction.order_amount !== transaction.transaction_amount && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Diff: ₹
                              {(transaction.transaction_amount - transaction.order_amount).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="table-cell">
                        <span className={getStatusBadgeClass(transaction.status)}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="table-cell responsive-hide-md">
                        <div className="text-sm">
                          <div>{new Date(transaction.payment_time).toLocaleDateString()}</div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {new Date(transaction.payment_time).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between flex-1 sm:hidden">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page <= 1}
                    className="btn btn-outline disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page >= pagination.total_pages}
                    className="btn btn-outline disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>

                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing page {filters.page} of {pagination.total_pages}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                        const page = i + Math.max(1, filters.page - 2)
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === filters.page
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                              }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No transactions found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions