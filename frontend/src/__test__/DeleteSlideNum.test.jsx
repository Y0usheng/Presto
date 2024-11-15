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

    it('should display slide number correctly within the slide', async () => {
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

        const slideNumberElement = screen.getByText('1');

        expect(slideNumberElement).toBeInTheDocument();
        expect(slideNumberElement).toHaveStyle({
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '50px',
            height: '50px',
            fontSize: '1em',
        });
    });

    it('should allow deleting the current slide', async () => {
        fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    store: [
                        {
                            id: 1,
                            name: 'Presentation 1',
                            description: 'Description 1',
                            slides: [
                                { page: 'Slide 1' },
                                { page: 'Slide 2' },
                                { page: 'Slide 3' },
                            ],
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

        expect(screen.getByText('Slide 1 of 3')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Delete Slide'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
        });

        expect(screen.getByText('Slide 1 of 2')).toBeInTheDocument();
    });

    it('should show error message when trying to delete the only slide', async () => {
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

        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });

        render(
            <BrowserRouter>
                <PresentationPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(fetch).toHaveBeenCalled();
        });

        fireEvent.click(screen.getByText('Delete Slide'));

        expect(alertSpy).toHaveBeenCalledWith(
            'Cannot delete the only slide. Please delete the presentation instead.'
        );

        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
