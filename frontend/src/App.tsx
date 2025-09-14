import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/UI/LoadingSpinner';
import Login from './pages/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import SchoolTransactions from './pages/SchoolTransactions';
import TransactionStatus from './pages/TransactionStatus';
import Settings from './pages/Settings';
import CreatePayment from './pages/CreatePayment';
import School from './pages/School';
import PaymentCallback from './pages/paymentCallBack';
const App = () => {
    const { user, loading } = useAuth()
   // console.log("User data" , user)

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }
    if (!user) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        )
    }
    return (

        <Layout>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/schools" element={<School />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/school-transactions" element={<SchoolTransactions />} />
                <Route path="/transaction-status" element={<TransactionStatus />} />
                <Route path="/create-payment" element={<CreatePayment />} />
                <Route path="/payment-callback" element={<PaymentCallback />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Layout>
    )
}

export default App