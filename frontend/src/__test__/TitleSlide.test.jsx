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

    it('should display the presentation title at all times', async () => {
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
            expect(fetch).toHaveBeenCalled();
        });

        expect(screen.getByText('Slide title: Presentation 1')).toBeInTheDocument();
    });

    it('should allow adding a new slide', async () => {
        fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    store: [
                        {
                            id: 1,
                            name: 'Presentation 1',
                            description: 'Description 1',
                            slides: [{ page: 'Slide 1' }],
                            slidesCount: 1,
                        },
                    ],
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            });

        render(
            <BrowserRouter>
                <PresentationPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText('Slide 1 of 1')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Add Slide'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
        });

        expect(screen.getByText('Slide 1 of 2')).toBeInTheDocument();
    });

    it('should display navigation arrows when there are at least two slides', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                store: [
                    {
                        id: 1,
                        name: 'Presentation 1',
                        description: 'Description 1',
                        slides: [{ page: 'Slide 1' }, { page: 'Slide 2' }],
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
            expect(fetch).toHaveBeenCalled();
        });

        const previousButton = screen.getByText('Previous');
        const nextButton = screen.getByText('Next');

        expect(previousButton).toBeInTheDocument();
        expect(nextButton).toBeInTheDocument();

        expect(previousButton).toBeDisabled();
        expect(nextButton).not.toBeDisabled();

        fireEvent.click(nextButton);

        expect(screen.getByText('Slide 2 of 2')).toBeInTheDocument();

        expect(previousButton).not.toBeDisabled();
        expect(nextButton).toBeDisabled();
    });

    it('should navigate between slides using arrow buttons', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                store: [
                    {
                        id: 1,
                        name: 'Presentation 1',
                        description: 'Description 1',
                        slides: [{ page: 'Slide 1' }, { page: 'Slide 2' }, { page: 'Slide 3' }],
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
            expect(fetch).toHaveBeenCalled();
        });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);
        expect(screen.getByText('Slide 2 of 3')).toBeInTheDocument();

        fireEvent.click(nextButton);
        expect(screen.getByText('Slide 3 of 3')).toBeInTheDocument();

        expect(nextButton).toBeDisabled();

        const previousButton = screen.getByText('Previous');
        fireEvent.click(previousButton);
        expect(screen.getByText('Slide 2 of 3')).toBeInTheDocument();

        fireEvent.click(previousButton);
        expect(screen.getByText('Slide 1 of 3')).toBeInTheDocument();

        expect(previousButton).toBeDisabled();
    });
});
