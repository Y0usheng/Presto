import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '../components/RegisterPage';
import { vi } from 'vitest';
import { BrowserRouter, useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe('RegisterPage Component', () => {
    let navigate;

    beforeEach(() => {
        navigate = vi.fn();
        const mockedUseNavigate = useNavigate;
        mockedUseNavigate.mockReturnValue(navigate);

        global.fetch = vi.fn();

        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should register successfully with valid data', async () => {
        const mockToken = 'mocked_token';
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: mockToken }),
        });

        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Name'), {
            target: { value: 'Test User' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:5005/admin/auth/register',
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'test@example.com',
                        name: 'Test User',
                        password: 'password123',
                    }),
                })
            );
        });

        expect(localStorage.getItem('token')).toEqual(mockToken);

        expect(navigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should show error when passwords do not match', async () => {
        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Name'), {
            target: { value: 'Test User' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: 'differentPassword' },
        });

        fireEvent.click(screen.getByText('Register'));

        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();

        expect(fetch).not.toHaveBeenCalled();

        expect(navigate).not.toHaveBeenCalled();
    });

    it('should display an error message when registration fails', async () => {
        const mockError = 'Email already in use';
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: mockError }),
        });

        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Name'), {
            target: { value: 'Test User' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => {
            expect(screen.getByText(mockError)).toBeInTheDocument();
        });

        expect(navigate).not.toHaveBeenCalled();

        expect(localStorage.getItem('token')).toBeNull();
    });
});