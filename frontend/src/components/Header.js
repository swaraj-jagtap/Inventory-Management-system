import React, { useState } from 'react';
import { ChevronDown, Bell, User, LogOut } from 'lucide-react';

const Header = ({ user, onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center border-b border-gray-700 no-print">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-200">Welcome, {user.name}!</h1>
            </div>
            <div className="flex items-center space-x-6">
                <button className="relative text-gray-400 hover:text-white">
                    <Bell size={24} />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-gray-800"></span>
                </button>
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <ChevronDown size={20} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-20 border border-gray-700">
                            <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-xs">{user.role}</p>
                            </div>
                            <button className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                                <User size={16} className="mr-2" /> Profile
                            </button>
                            <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                                <LogOut size={16} className="mr-2" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;