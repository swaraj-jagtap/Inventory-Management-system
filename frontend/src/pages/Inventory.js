import React, { useState } from 'react';
import { Search, PlusCircle, Barcode, Trash2, Edit, Tag } from 'lucide-react';
import Modal from '../components/Modal';
import { BarcodeCanvas } from '../components/Barcode';
import PriceLabel from '../components/PriceLabel';

const Inventory = ({ products, API_URL, showNotification, refreshData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPriceLabelModalOpen, setIsPriceLabelModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [selectedBarcode, setSelectedBarcode] = useState(null);
    const [selectedProductForLabel, setSelectedProductForLabel] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const allCategories = ['All', ...new Set(products.map(p => p.category))];

    const handleOpenModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = async (productData) => {
        const url = editingProduct ? `${API_URL}/products/${editingProduct._id}` : `${API_URL}/products`;
        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            if (!response.ok) throw new Error('Failed to save product.');
            
            showNotification(`Product ${editingProduct ? 'updated' : 'added'} successfully!`, 'success');
            refreshData(); // Refresh data from backend
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            handleCloseModal();
        }
    };
    
    const handleOpenDeleteModal = (product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setProductToDelete(null);
        setIsDeleteModalOpen(false);
    };
    
    const handleDeleteProduct = async () => {
        if (!productToDelete) return;

        try {
            const response = await fetch(`${API_URL}/products/${productToDelete._id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete product.');
            
            showNotification('Product deleted successfully!', 'success');
            refreshData();
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            handleCloseDeleteModal();
        }
    };

    const handleGenerateBarcode = (product) => {
        setSelectedBarcode(product);
        setIsBarcodeModalOpen(true);
    };
    
    const handleOpenPriceLabelModal = (product) => {
        setSelectedProductForLabel(product);
        setIsPriceLabelModalOpen(true);
    };

    const handleClosePriceLabelModal = () => {
        setIsPriceLabelModalOpen(false);
        setSelectedProductForLabel(null);
    };

    const filteredProducts = products
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(p => filterCategory === 'All' || p.category === filterCategory);

    const ProductForm = ({ product, onSave, onCancel }) => {
        const [formData, setFormData] = useState({
            name: product?.name || '',
            category: product?.category || '',
            quantity: product?.quantity || 0,
            price: product?.price || 0,
            description: product?.description || '',
            expiryDate: product?.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : '',
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(formData);
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
                    <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price (₹)" className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
                </div>
                 <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Product Description" rows="3" className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 col-span-2"></textarea>
                <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="Expiry Date (Optional)" className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="py-2 px-5 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors">Cancel</button>
                    <button type="submit" className="py-2 px-5 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors">Save Product</button>
                </div>
            </form>
        );
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Inventory</h2>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition-colors">
                    <PlusCircle size={20} className="mr-2" /> Add Product
                </button>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl mb-6 border border-gray-700 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-700 text-white p-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-900">
                            <tr>
                                <th scope="col" className="px-6 py-3">Product Name</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">SKU</th>
                                <th scope="col" className="px-6 py-3">Quantity</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product._id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                                    <td className="px-6 py-4">{product.category}</td>
                                    <td className="px-6 py-4">{product.sku}</td>
                                    <td className="px-6 py-4">
                                        <span className={product.quantity <= 10 ? 'text-yellow-400 font-bold' : ''}>
                                            {product.quantity}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">₹{product.price}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button onClick={() => handleGenerateBarcode(product)} className="p-2 text-gray-400 hover:text-blue-400 transition-colors" title="Generate Barcode"><Barcode size={18} /></button>
                                            <button onClick={() => handleOpenPriceLabelModal(product)} className="p-2 text-gray-400 hover:text-purple-400 transition-colors" title="Print Price Label"><Tag size={18} /></button>
                                            <button onClick={() => handleOpenModal(product)} className="p-2 text-gray-400 hover:text-green-400 transition-colors" title="Edit"><Edit size={18} /></button>
                                            <button onClick={() => handleOpenDeleteModal(product)} className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Delete"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct ? "Edit Product" : "Add New Product"}>
                <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={handleCloseModal} />
            </Modal>
            
            <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} title="Confirm Deletion">
                <p className="mb-6">Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={handleCloseDeleteModal} className="py-2 px-5 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors">Cancel</button>
                    <button onClick={handleDeleteProduct} className="py-2 px-5 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors">Delete</button>
                </div>
            </Modal>

            <Modal isOpen={isBarcodeModalOpen} onClose={() => setIsBarcodeModalOpen(false)} title={`Barcode for ${selectedBarcode?.name}`}>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg">
                    {selectedBarcode && <BarcodeCanvas value={selectedBarcode.sku} />}
                    <button onClick={() => window.print()} className="mt-6 py-2 px-5 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors no-print">Print</button>
                </div>
            </Modal>
            
            <Modal isOpen={isPriceLabelModalOpen} onClose={handleClosePriceLabelModal} title={`Price Label for ${selectedProductForLabel?.name}`}>
                <PriceLabel product={selectedProductForLabel} />
            </Modal>
        </div>
    );
};

export default Inventory;