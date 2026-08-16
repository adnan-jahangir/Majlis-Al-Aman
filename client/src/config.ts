/// <reference types="vite/client" />

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://majlis-al-aman.onrender.com/api' : '/api');

export { API_BASE };
