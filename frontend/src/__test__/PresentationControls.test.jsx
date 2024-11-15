import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PresentationPage from '../components/PresentationPage';
import { vi } from 'vitest';
import { BrowserRouter, MemoryRouter, Route, Routes, useNavigate, useParams } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
        useParams: vi.fn(),
    };
});

describe('PresentationPage Component', () => {
    let navigate;
    let params;

    beforeEach(() => {
        navigate = vi.fn();
        const mockedUseNavigate = useNavigate;
        mockedUseNavigate.mockReturnValue(navigate);

        params = { id: '1', slideNumber: '1' };
        const mockedUseParams = useParams;
        mockedUseParams.mockReturnValue(params);

        global.fetch = vi.fn();

        localStorage.setItem('token', 'mocked_token');
    });

    afterEach(() => {
        vi.restoreAllMocks();
        localStorage.clear();
    });

    it('should navigate back to the dashboard when "Back" button is clicked', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                store: [
                    {
                        id: 1,
                        name: 'Presentation 1',
                        description: 'Description 1',
                        slides: [{ page: 'Slide 1' }],
                    },
                ],
            }),
        });

        render(
            <BrowserRouter>
                <PresentationPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:5005/store', expect.anything());
        });

        fireEvent.click(screen.getByLabelText('back'));

        expect(navigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should show confirmation dialog when "Delete Presentation" button is clicked', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                store: [
                    {
                        id: 1,
                        name: 'Presentation 1',
                        description: 'Description 1',
                        slides: [{ page: 'Slide 1' }],
                    },
                ],
            }),
        });

        const confirmSpy = vi.spyOn(window, 'confirm');

        render(
            <BrowserRouter>
                <PresentationPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });

        fireEvent.click(screen.getByText('Delete Presentation'));

        expect(confirmSpy).toHaveBeenCalledWith('Are you sure?');
    });

    it('should not delete the presentation when "No" is clicked in confirmation dialog', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                store: [
                    {
                        id: 1,
                        name: 'Presentation 1',
                        description: 'Description 1',
                        slides: [{ page: 'Slide 1' }],
                    },
                ],
            }),
        });

        vi.spyOn(window, 'confirm').mockReturnValueOnce(false);

        render(
            <BrowserRouter>
                <PresentationPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        fireEvent.click(screen.getByText('Delete Presentation'));

        expect(window.confirm).toHaveBeenCalledWith('Are you sure?');

        expect(fetch).toHaveBeenCalledTimes(1);

        expect(navigate).not.toHaveBeenCalledWith('/dashboard');
    });
});
