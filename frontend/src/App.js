// App.js
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Notification from './components/Notification';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import GenericEntityPage from './pages/GenericEntityPage';
import LoginPage from './pages/LoginPage';

// ✅ Use full backend URL since backend runs on 5001
const API_URL = process.env.BACKEND_API_URL;

export default function App() {
    const [user, setUser] = useState(null);
    const [page, setPage] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(true);

    const showNotification = useCallback((message, type = 'info') => {
        setNotification({ message, type });
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [productsRes, customersRes, statsRes] = await Promise.all([
                fetch(`${API_URL}/products`),
                fetch(`${API_URL}/customers`),
                fetch(`${API_URL}/dashboard/stats`),
            ]);
            const productsData = await productsRes.json();
            const customersData = await customersRes.json();
            const statsData = await statsRes.json();

            setProducts(productsData);
            setCustomers(customersData);
            setDashboardStats(statsData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            showNotification("Could not connect to the server.", "error");
        } finally {
            setLoading(false);
        }
    }, [showNotification]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, fetchData]);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
        setPage('dashboard');
    };

    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-900 text-white items-center justify-center">
                <p>Loading Data...</p>
            </div>
        );
    }

    const renderPage = () => {
        switch (page) {
            case 'dashboard':
                return <Dashboard products={products} stats={dashboardStats} />;
            case 'inventory':
                return <Inventory products={products} API_URL={API_URL} showNotification={showNotification} refreshData={fetchData} />;
            case 'billing':
                return <Billing products={products} customers={customers} API_URL={API_URL} showNotification={showNotification} refreshData={fetchData} />;
            case 'customers':
                return <GenericEntityPage
                    title="Customers"
                    items={customers}
                    API_URL={`${API_URL}/customers`}
                    refreshData={fetchData}
                    entityName="Customer"
                    formFields={[
                        { name: 'name', type: 'text', placeholder: 'Customer Name' },
                        { name: 'email', type: 'email', placeholder: 'Email Address' },
                        { name: 'phone', type: 'tel', placeholder: 'Phone Number' },
                    ]}
                />;
            default:
                return <Dashboard products={products} stats={dashboardStats} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            <Sidebar user={user} onNavigate={setPage} activePage={page} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={user} onLogout={handleLogout} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}
