import React from 'react';
import ReactDOM from 'react-dom/client';
import './tailwind.css'; // Import the generated tailwind css file
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);