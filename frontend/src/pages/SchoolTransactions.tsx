import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { school, transactionAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import type { School } from '../types';
import { useForm } from 'react-hook-form';

const SchoolTransactions = () => {
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: 'payment_time',
    order: 'desc',
    status: ''
  });

  const { data, isLoading, error } = useQuery(
    ['school-transactions', selectedSchoolId, filters],
    () => transactionAPI.getSchoolTransactions(selectedSchoolId, filters),
    {
      enabled: !!selectedSchoolId,
      keepPreviousData: true,
      refetchInterval: 30000
    }
  );

  const { register, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const data = await school.getAllSchools();
        setSchools(data);
      } catch (err) {
        console.error("Error fetching schools:", err);
      }
    };
    fetchSchools();
  }, []);

  const transactions = (data?.data?.data?.transactions || []).sort(
    (a, b) => new Date(b.payment_time).getTime() - new Date(a.payment_time).getTime()
  );
  const pagination = data?.data?.pagination || {};

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-2">Error loading school transactions</div>
        <p className="text-gray-600">{(error as any)?.response?.data?.message || (error as any)?.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className='' >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">School Transactions</h1>
        <p className="text-gray-600 mt-1 dark:text-white">View transactions for a specific school</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">Select School *</label>
          <select
            className="w-full border rounded p-2"
            {...register('school_id', { required: 'School is required' })}
            value={selectedSchoolId}
            onChange={(e) => setSelectedSchoolId(e.target.value)}
          >
            <option value="">-- Select a School --</option>
            {schools.map(s => (
              <option key={s._id} value={s._id}>{s.name || s._id}</option>
            ))}
          </select>
          {errors.school_id && <p className="text-red-500 text-sm mt-1">{errors.school_id.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">Status Filter</label>
          <select
            className="w-full border rounded p-2 "
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">Per Page</label>
          <select
            className="w-full border rounded p-2"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      {selectedSchoolId && (
        <div className="text-sm text-gray-600 dark:text-white">
          Showing {transactions.length} of {pagination.total_count || 0} transactions for school: {selectedSchoolId}
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 dark:text-white shadow rounded overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-600">No transactions found for this school.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Order ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Student</th>
                <th className="px-4 py-2 text-left text-sm font-medium hidden sm:table-cell">Gateway</th>
                <th className="px-4 py-2 text-left text-sm font-medium hidden sm:table-cell">Payment Mode</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium hidden md:table-cell">Payment Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((tx) => (

                <tr key={tx.collect_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {console.log(tx)}
                  <td className="px-4 py-2 font-medium text-primary-600">{tx.custom_order_id}</td>
                  <td className="px-4 py-2">
                    <div className="font-medium">{tx.student_info?.name}</div>
                    <div className="text-sm text-gray-500">ID: {tx.student_info?.id}</div>
                    <div className="text-sm text-gray-500">{tx.student_info?.email}</div>
                  </td>
                  <td className="px-4 py-2 hidden sm:table-cell">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{tx.gateway}</span>
                  </td>
                  <td className="px-4 py-2 hidden sm:table-cell">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{tx.payment_mode}</span>
                  </td>
                  <td className="px-4 py-2">₹{tx.transaction_amount?.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${getStatusBadgeClass(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 hidden md:table-cell">
                    <div>{new Date(tx.payment_time).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">{new Date(tx.payment_time).toLocaleTimeString()}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex justify-center mt-4 space-x-1">
          {Array.from({ length: pagination.total_pages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded border ${filters.page === i + 1 ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchoolTransactions;
