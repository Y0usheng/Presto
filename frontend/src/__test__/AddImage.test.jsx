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

describe('PresentationPage Component - Adding Image to Slide', () => {
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

    it('should allow adding an image to the current slide', async () => {
        fetch
            .mockResolvedValueOnce({
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
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({}),
            });

        const mockFileReader = {
            readAsDataURL: vi.fn(),
            onloadend: null,
        };
        global.FileReader = vi.fn(() => mockFileReader);

        render(
            <BrowserRouter>
                <PresentationPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        const addImageButton = screen.getByRole('button', { name: 'Add Image' });
        fireEvent.click(addImageButton);

        const modalTitle = screen.getByRole('heading', { name: 'Add Image' });
        expect(modalTitle).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText('Image URL'), {
            target: { value: 'https://example.com/image.png' },
        });
        fireEvent.change(screen.getByLabelText('Size (%)'), {
            target: { value: '50' },
        });
        fireEvent.change(screen.getByLabelText('Alt Text'), {
            target: { value: 'Example Image' },
        });

        const addImageButtonInModal = screen.getByRole('button', { name: 'Add Image' });
        fireEvent.click(addImageButtonInModal);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
        });

        const imageElement = screen.getByAltText('Example Image');
        expect(imageElement).toBeInTheDocument();

        expect(imageElement).toHaveAttribute('src', 'https://example.com/image.png');
        expect(imageElement).toHaveStyle({
            position: 'absolute',
            width: '50%',
            border: '1px solid grey',
        });
    });

    it('should allow editing the image properties by double-clicking', async () => {
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
                                {
                                    page: 'Slide 1',
                                    elements: [
                                        {
                                            type: 'image',
                                            source: 'https://example.com/image.png',
                                            size: 50,
                                            alt: 'Example Image',
                                            position: { x: 0, y: 0 },
                                        },
                                    ],
                                },
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

        const imageElement = screen.getByAltText('Example Image');
        expect(imageElement).toBeInTheDocument();

        fireEvent.doubleClick(imageElement);

        const modalTitle = screen.getByRole('heading', { name: 'Edit Image' });
        expect(modalTitle).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText('Image URL'), {
            target: { value: 'https://example.com/updated-image.png' },
        });
        fireEvent.change(screen.getByLabelText('Size (%)'), {
            target: { value: '60' },
        });
        fireEvent.change(screen.getByLabelText('Alt Text'), {
            target: { value: 'Updated Image' },
        });

        const saveChangesButton = screen.getByRole('button', { name: 'Save Changes' });
        fireEvent.click(saveChangesButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
        });

        const updatedImageElement = screen.getByAltText('Updated Image');
        expect(updatedImageElement).toBeInTheDocument();
        expect(updatedImageElement).toHaveAttribute('src', 'https://example.com/updated-image.png');

        expect(updatedImageElement).toHaveStyle({
            width: '60%',
        });
    });
});
