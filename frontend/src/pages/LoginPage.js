import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const uname = username.toLowerCase();
        if ((uname === 'swaraj' && password === 'Swaraj@2004') || (uname === 'staff' && password === 'staff123')) {
            const role = uname === 'swaraj' ? 'Swaraj' : 'Staff';
            onLogin({ name: username.charAt(0).toUpperCase() + username.slice(1), role });
        } else {
            setError('Invalid credentials. Try "Swaraj/Swaraj@2004" or "staff/staff123".');
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center font-sans">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
                <div className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <img
                            src="/vrindavan_logo.png"
                            alt="Vrindavan Garden Logo"
                            className="w-20 h-20 object-contain"
                        />
                        <h1 className="text-4xl font-extrabold text-white ml-2">Vrindavan</h1>
                    </div>
                    <p className="text-gray-400">Inventory Management System</p>
                </div>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter 'Swaraj' or 'staff'"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter 'Swaraj@2004' or 'staff123'"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <div>
                        <button type="submit" className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition-colors">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
