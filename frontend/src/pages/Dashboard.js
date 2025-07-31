import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, ShoppingCart, Bell, Trash2 } from 'lucide-react';

const Dashboard = ({ products, stats }) => {
    // These are now calculated on the frontend from the full products list
    const lowStockItems = products.filter(p => p.quantity <= 10);
    const expiringSoonItems = products.filter(p => p.expiryDate && new Date(p.expiryDate) < new Date(new Date().setDate(new Date().getDate() + 30)));

    // Helper to format large numbers into "k" format (e.g., 12500 -> 12.5k)
    const formatCurrency = (value) => {
        if (value >= 1000) {
            return `₹${(value / 1000).toFixed(1)}k`;
        }
        return `₹${value}`;
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className={`bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center justify-between`}>
            <div>
                <p className="text-sm text-gray-400 font-medium">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                {icon}
            </div>
        </div>
    );

    return (
        <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Inventory Value" value={formatCurrency(stats?.totalInventoryValue || 0)} icon={<Package size={24} />} color="bg-blue-500 bg-opacity-30 text-blue-300" />
                <StatCard title="Daily Sales" value={formatCurrency(stats?.dailySales || 0)} icon={<ShoppingCart size={24} />} color="bg-green-500 bg-opacity-30 text-green-300" />
                <StatCard title="Low Stock Items" value={lowStockItems.length} icon={<Bell size={24} />} color="bg-yellow-500 bg-opacity-30 text-yellow-300" />
                <StatCard title="Expiring Soon" value={expiringSoonItems.length} icon={<Trash2 size={24} />} color="bg-red-500 bg-opacity-30 text-red-300" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Sales (Last 30 Days)</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={stats?.monthlySales || []} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                                <XAxis dataKey="date" tick={{ fill: '#a0aec0' }} />
                                <YAxis tick={{ fill: '#a0aec0' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }} />
                                <Legend wrapperStyle={{ color: '#a0aec0' }} />
                                <Bar dataKey="sales" fill="#48bb78" name="Sales (₹)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Low Stock Alerts</h3>
                    <ul className="space-y-4">
                        {lowStockItems.length > 0 ? lowStockItems.slice(0, 5).map(item => (
                            <li key={item._id} className="flex justify-between items-center">
                                <div>
                                    <p className="text-white font-medium">{item.name}</p>
                                    <p className="text-xs text-gray-400">{item.category}</p>
                                </div>
                                <span className="bg-yellow-500 bg-opacity-20 text-yellow-300 text-sm font-bold py-1 px-3 rounded-full">{item.quantity} left</span>
                            </li>
                        )) : <p className="text-gray-500">No items with low stock.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;