// src/utils/api.js

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

async function apiFetch(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const token = localStorage.getItem('token');
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }

    return data;
}

export const api = {
    // Auth
    login: (email, password) =>
        apiFetch('/admin/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        }),

    register: (email, name, password) =>
        apiFetch('/admin/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, name, password }),
        }),

    // Store
    getStore: () =>
        apiFetch('/store', { method: 'GET' }),

    updateStore: (store) =>
        apiFetch('/store', {
            method: 'PUT',
            body: JSON.stringify({ store })
        }),
};