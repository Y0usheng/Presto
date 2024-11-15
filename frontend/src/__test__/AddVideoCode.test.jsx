import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PresentationPage from '../components/PresentationPage';
import { vi } from 'vitest';
import { BrowserRouter, useNavigate, useParams } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
        useParams: vi.fn(),
    };
});

describe('PresentationPage Component - Adding Video to Slide', () => {
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

    it('should display the action to add a video', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                store: [
                    {
                        id: 1,
                        name: 'Presentation 1',
                        description: 'Description 1',
                        slides: [{ page: 'Slide 1', elements: [] }],
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
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        const addVideoButton = screen.getByRole('button', { name: 'Add Video' });
        expect(addVideoButton).toBeInTheDocument();
    });

    it('should display the action to add a code block', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                store: [
                    {
                        id: 1,
                        name: 'Presentation 1',
                        description: 'Description 1',
                        slides: [{ page: 'Slide 1', elements: [] }],
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
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        const addCodeBlockButton = screen.getByRole('button', { name: 'Add Code Block' });
        expect(addCodeBlockButton).toBeInTheDocument();
    });

    it('should open the Add Code Block modal when the button is clicked', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                store: [
                    {
                        id: 1,
                        name: 'Presentation 1',
                        description: 'Description 1',
                        slides: [{ page: 'Slide 1', elements: [] }],
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
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        const addCodeBlockButton = screen.getByRole('button', { name: 'Add Code Block' });
        fireEvent.click(addCodeBlockButton);

        const modalTitle = screen.getByRole('heading', { name: 'Add Code Block' });
        expect(modalTitle).toBeInTheDocument();
    });
});
