import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../components/Dashboard';
import { vi } from 'vitest';
import { BrowserRouter, useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe('Dashboard Component', () => {
    let navigate;

    beforeEach(() => {
        navigate = vi.fn();
        const mockedUseNavigate = useNavigate;
        mockedUseNavigate.mockReturnValue(navigate);

        global.fetch = vi.fn();

        localStorage.setItem('token', 'mocked_token');
    });

    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it('should fetch and display presentations correctly', async () => {
        const mockPresentations = [
            {
                id: 1,
                name: 'Presentation 1',
                description: 'Description 1',
                thumbnail: 'https://example.com/thumbnail1.jpg',
                slidesCount: 5,
            },
            {
                id: 2,
                name: 'Presentation 2',
                description: 'Description 2',
                thumbnail: 'https://example.com/thumbnail2.jpg',
                slidesCount: 3,
            },
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ store: mockPresentations }),
        });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:5005/store',
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                        Authorization: `Bearer mocked_token`,
                    }),
                })
            );
        });

        expect(screen.getByText('Presentation 1')).toBeInTheDocument();
        expect(screen.getByText('Description 1')).toBeInTheDocument();
        expect(screen.getByText('Slides: 5')).toBeInTheDocument();

        expect(screen.getByText('Presentation 2')).toBeInTheDocument();
        expect(screen.getByText('Description 2')).toBeInTheDocument();
        expect(screen.getByText('Slides: 3')).toBeInTheDocument();
    });

    it('should display a message when there are no presentations', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ store: [] }),
        });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });

        expect(
            screen.getByText('There is no project, please create a new project!')
        ).toBeInTheDocument();
    });

    it('should redirect to login if no token is present', () => {
        localStorage.removeItem('token');

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        expect(navigate).toHaveBeenCalledWith('/login');
    });

    it('should log out successfully when logout button is clicked', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ store: [] }),
        });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:5005/store',
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                        Authorization: `Bearer mocked_token`,
                    }),
                })
            );
        });

        fireEvent.click(screen.getByText('Logout'));

        expect(localStorage.getItem('token')).toBeNull();

        expect(navigate).toHaveBeenCalledWith('/login');
    });
});
