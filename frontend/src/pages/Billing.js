import React, { useState } from 'react';
import { Search, PlusCircle, Trash2, FileText } from 'lucide-react';
import Modal from '../components/Modal';

const Billing = ({ products, customers, API_URL, showNotification, refreshData }) => {
    const [cart, setCart] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?._id || '');
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const addToCart = (product) => {
        const existingItem = cart.find(item => item._id === product._id);
        if (product.quantity === 0) {
            showNotification("This product is out of stock!", 'error');
            return;
        }
        if (existingItem) {
            if (existingItem.qty < product.quantity) {
                 setCart(cart.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item));
            } else {
                 showNotification("Cannot add more than available stock.", 'error');
            }
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const updateQuantity = (productId, newQty) => {
        const product = products.find(p => p._id === productId);
        if (newQty > 0 && newQty <= product.quantity) {
            setCart(cart.map(item => item._id === productId ? { ...item, qty: newQty } : item));
        } else if (newQty === 0) {
            removeFromCart(productId);
        } else {
            showNotification("Cannot set quantity greater than available stock.", 'error');
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item._id !== productId));
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleFinalizeSale = async () => {
        if (cart.length === 0) {
            showNotification("Cart is empty. Please add products to proceed.", 'error');
            return;
        }
        if (!selectedCustomer) {
            showNotification("Please select a customer.", 'error');
            return;
        }

        const saleData = {
            customer: selectedCustomer,
            items: cart.map(item => ({
                product: item._id,
                quantity: item.qty,
                price: item.price
            })),
            totalAmount: total
        };

        try {
            const response = await fetch(`${API_URL}/sales`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saleData),
            });
            if (!response.ok) throw new Error('Failed to record sale.');

            showNotification('Sale recorded successfully!', 'success');
            refreshData();
            setIsInvoiceModalOpen(true);
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };
    
    const handleCloseInvoice = () => {
        setIsInvoiceModalOpen(false);
        setCart([]);
    };

    const Invoice = ({ cart, total, customer, onClose }) => (
        <div className="printable-area bg-white text-gray-800 p-8 rounded-lg max-w-2xl mx-auto my-4">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Invoice</h2>
                    <p className="text-gray-500">Vrindavan Garden Center</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold">Invoice #: INV-{Date.now()}</p>
                    <p>Date: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
            <div className="mb-6">
                <h3 className="font-semibold text-gray-700">Bill To:</h3>
                <p>{customer?.name}</p>
                <p>{customer?.email}</p>
                <p>{customer?.phone}</p>
            </div>
            <table className="w-full mb-6">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="text-left p-2">Item</th>
                        <th className="text-center p-2">Quantity</th>
                        <th className="text-right p-2">Price</th>
                        <th className="text-right p-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map(item => (
                        <tr key={item._id} className="border-b">
                            <td className="p-2">{item.name}</td>
                            <td className="text-center p-2">{item.qty}</td>
                            <td className="text-right p-2">₹{Number(item.price).toFixed(2)}</td>
                            <td className="text-right p-2">₹{(Number(item.price) * item.qty).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-right">
                <p className="text-gray-600">Subtotal: <span className="font-semibold">₹{total.toFixed(2)}</span></p>
                <p className="text-gray-600">Tax (0%): <span className="font-semibold">₹0.00</span></p>
                <p className="text-xl font-bold mt-2">Total: <span className="text-green-600">₹{total.toFixed(2)}</span></p>
            </div>
            <div className="mt-8 text-center no-print">
                <p className="text-gray-500 text-sm">Thank you for your business!</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <button onClick={onClose} className="py-2 px-5 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors">Close</button>
                    <button onClick={() => window.print()} className="py-2 px-5 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors">Print Invoice</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl border border-gray-700 flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-4">Products</h2>
                <div className="relative mb-4">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-700 text-white p-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="flex-grow overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredProducts.map(product => (
                            <div key={product._id} className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-white">{product.name}</h3>
                                    <p className="text-sm text-gray-400">{product.category}</p>
                                    <p className="text-lg font-semibold text-green-400 mt-2">₹{product.price}</p>
                                </div>
                                <div className="flex justify-between items-center mt-3">
                                    <p className="text-xs text-gray-500">Stock: {product.quantity}</p>
                                    <button onClick={() => addToCart(product)} className="bg-green-600 text-white rounded-full p-2 hover:bg-green-500 transition-colors disabled:bg-gray-500" disabled={product.quantity === 0}>
                                        <PlusCircle size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-4">Current Sale</h2>
                <div className="mb-4">
                    <label htmlFor="customer" className="block text-sm font-medium text-gray-400 mb-1">Customer</label>
                    <select id="customer" value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="">Select a customer</option>
                        {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                    {cart.length > 0 ? cart.map(item => (
                        <div key={item._id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                            <div>
                                <p className="font-semibold text-white">{item.name}</p>
                                <p className="text-sm text-gray-400">₹{item.price} x {item.qty}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input 
                                    type="number" 
                                    value={item.qty} 
                                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                                    className="w-16 bg-gray-800 text-white p-1 text-center rounded"
                                    min="0"
                                    max={item.quantity}
                                />
                                <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    )) : <p className="text-gray-500 text-center py-10">Cart is empty</p>}
                </div>
                <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between items-center text-xl font-bold text-white">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                    <button onClick={handleFinalizeSale} className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors flex items-center justify-center">
                        <FileText size={20} className="mr-2" /> Finalize & Generate Invoice
                    </button>
                </div>
            </div>
            
            <Modal isOpen={isInvoiceModalOpen} onClose={handleCloseInvoice} title="Sale Invoice">
                <Invoice cart={cart} total={total} customer={customers.find(c => c._id === selectedCustomer)} onClose={handleCloseInvoice} />
            </Modal>
        </div>
    );
};

export default Billing;