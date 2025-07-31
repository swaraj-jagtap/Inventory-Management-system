import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

const GenericEntityPage = ({ title, items, API_URL, refreshData, formFields, entityName }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSaveItem = async (itemData) => {
        const url = editingItem ? `${API_URL}/${editingItem._id}` : API_URL;
        const method = editingItem ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData),
            });
            refreshData();
        } catch (error) {
            console.error("Failed to save item", error);
        } finally {
            handleCloseModal();
        }
    };

    const handleOpenDeleteModal = (item) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setItemToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleDeleteItem = async () => {
        if (!itemToDelete) return;
        try {
            await fetch(`${API_URL}/${itemToDelete._id}`, { method: 'DELETE' });
            refreshData();
        } catch (error) {
            console.error("Failed to delete item", error);
        } finally {
            handleCloseDeleteModal();
        }
    };

    const EntityForm = ({ item, onSave, onCancel }) => {
        const [formData, setFormData] = useState(
            formFields.reduce((acc, field) => {
                acc[field.name] = item?.[field.name] || '';
                return acc;
            }, {})
        );

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
                {formFields.map(field => (
                    <input
                        key={field.name}
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                ))}
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="py-2 px-5 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors">Cancel</button>
                    <button type="submit" className="py-2 px-5 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors">Save {entityName}</button>
                </div>
            </form>
        );
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">{title}</h2>
                <button onClick={() => handleOpenModal()} className="flex items-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition-colors">
                    <PlusCircle size={20} className="mr-2" /> Add {entityName}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item._id} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-green-400">{item.name}</h3>
                            {Object.keys(item).filter(key => !['_id', 'name', '__v', 'createdAt', 'updatedAt'].includes(key)).map(key => (
                                <p key={key} className="text-gray-300 capitalize"><span className="font-semibold">{key}:</span> {item[key]}</p>
                            ))}
                        </div>
                        <div className="flex items-center justify-end space-x-2 mt-4">
                            <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-400 hover:text-green-400 transition-colors" title="Edit"><Edit size={18} /></button>
                            <button onClick={() => handleOpenDeleteModal(item)} className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Delete"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? `Edit ${entityName}` : `Add New ${entityName}`}>
                <EntityForm item={editingItem} onSave={handleSaveItem} onCancel={handleCloseModal} />
            </Modal>
            
            <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} title={`Confirm Deletion`}>
                <p className="mb-6">Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={handleCloseDeleteModal} className="py-2 px-5 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors">Cancel</button>
                    <button onClick={handleDeleteItem} className="py-2 px-5 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors">Delete</button>
                </div>
            </Modal>
        </div>
    );
};

export default GenericEntityPage;