import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    const styles = {
        error: 'bg-red-600 border-red-800',
        info: 'bg-blue-600 border-blue-800',
        success: 'bg-green-600 border-green-800',
    };

    return (
        <div className={`fixed top-20 right-5 p-4 rounded-lg shadow-2xl z-[100] flex items-center justify-between text-white border-b-4 animate-fade-in-down ${styles[type] || styles.info}`}>
            <p className="font-medium">{message}</p>
            <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-black/20 transition-colors">
                <X size={18} />
            </button>
        </div>
    );
};

export default Notification;
