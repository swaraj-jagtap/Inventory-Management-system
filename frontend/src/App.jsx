import React, { useState, useEffect } from 'react';
import { MOCK_DATA } from './data/mockData.js';

// Import Pages
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Inventory from './pages/Inventory.jsx';
import Billing from './pages/Billing.jsx';
import Customers from './pages/Customers.jsx';

// Import Components
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.js';
import Notification from './components/Notification.jsx';


export default function App() {
    const [user, setUser] = useState(null);
    const [page, setPage] = useState('dashboard');
    const [products, setProducts] = useState(MOCK_DATA.products);
    const [customers, setCustomers] = useState(MOCK_DATA.customers);
    const [notification, setNotification] = useState({ message: '', type: '' });

    // Load JsBarcode library from CDN on component mount
    useEffect(() => {
        const scriptId = 'jsbarcode-script';
        if (document.getElementById(scriptId)) return; // Avoid re-adding the script

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Clean up the script when the component unmounts
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                 document.body.removeChild(existingScript);
            }
        };
    }, []);

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
    };

    const handleLogin = (userData) => {
        setUser(userData);
        showNotification(`Welcome, ${userData.name}!`, 'success');
    };

    const handleLogout = () => {
        setUser(null);
        setPage('dashboard'); // Reset to default page on logout
    };

    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const renderPage = () => {
        switch (page) {
            case 'dashboard':
                return <Dashboard products={products} />;
            case 'inventory':
                return <Inventory products={products} setProducts={setProducts} />;
            case 'billing':
                return <Billing products={products} customers={customers} setProducts={setProducts} showNotification={showNotification} />;
            case 'customers':
                return <Customers customers={customers} setCustomers={setCustomers} />;
            default:
                return <Dashboard products={products} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
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