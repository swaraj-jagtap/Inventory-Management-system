import React from 'react';
import { BarChart, Package, ShoppingCart, Users, Settings } from 'lucide-react';

const Sidebar = ({ user, onNavigate, activePage }) => {
    const navItems = [
        { name: 'Dashboard', icon: <BarChart size={20} />, page: 'dashboard' },
        { name: 'Inventory', icon: <Package size={20} />, page: 'inventory' },
        { name: 'Billing', icon: <ShoppingCart size={20} />, page: 'billing' },
        { name: 'Customers', icon: <Users size={20} />, page: 'customers' },
    ];

    return (
        <div className="bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out flex flex-col justify-between no-print">
            <div>
                <div className="text-white flex items-center space-x-2 px-4 mb-10">
                     <img
      src="/vrindavan_logo.png"
      alt="Vrindavan Garden Logo"
      className="w-16 h-13 object-contain"
    />
                    <span className="text-2xl font-extrabold">Vrindavan</span>
                </div>
                <nav>
                    {navItems.map(item => (
                        <button
                            key={item.name}
                            onClick={() => onNavigate(item.page)}
                            className={`w-full flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 text-left ${activePage === item.page ? 'bg-green-500 bg-opacity-30 text-green-300 font-semibold' : 'hover:bg-gray-700 hover:text-white'}`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </button>
                    ))}
                </nav>
            </div>
            <div className="px-4">
                <button className="w-full flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-700">
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;