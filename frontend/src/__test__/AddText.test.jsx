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

describe('PresentationPage Component - Adding Text to Slide', () => {
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

    it('should allow adding a text box to the current slide', async () => {
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

        render(
            <BrowserRouter>
                <PresentationPage />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        const addTextButton = screen.getByRole('button', { name: 'Add Text Element' });
        fireEvent.click(addTextButton);

        const modalTitle = screen.getByRole('heading', { name: 'Add Text Element' });
        expect(modalTitle).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText('Text Content'), {
            target: { value: 'Hello World' },
        });
        fireEvent.change(screen.getByLabelText('Size (%)'), {
            target: { value: '50' },
        });
        fireEvent.change(screen.getByLabelText('Font Size (em)'), {
            target: { value: '1.5' },
        });
        fireEvent.change(screen.getByLabelText('Text Color'), {
            target: { value: '#FF0000' },
        });

        const addTextButtonInModal = screen.getByRole('button', { name: 'Add Text' });
        fireEvent.click(addTextButtonInModal);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
        });

        const textElement = screen.getByText('Hello World');
        expect(textElement).toBeInTheDocument();

        const textContainer = textElement.parentElement;
        expect(textContainer).toHaveStyle({
            position: 'absolute',
            width: '50%',
            border: '1px solid grey',
        });
        expect(textElement).toHaveStyle({
            'font-size': '1.5em',
            color: '#FF0000',
        });
    });

    it('should allow editing the text box properties by double-clicking', async () => {
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
                                            type: 'text',
                                            text: 'Hello World',
                                            size: 50,
                                            fontSize: 1.5,
                                            color: '#FF0000',
                                            position: { x: 0, y: 0 },
                                            fontFamily: 'Arial',
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

        const textElement = screen.getByText('Hello World');
        expect(textElement).toBeInTheDocument();

        fireEvent.doubleClick(textElement.parentElement);

        const modalTitle = screen.getByRole('heading', { name: 'Edit Text Element' });
        expect(modalTitle).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText('Text Content'), {
            target: { value: 'Updated Text' },
        });
        fireEvent.change(screen.getByLabelText('Size (%)'), {
            target: { value: '60' },
        });
        fireEvent.change(screen.getByLabelText('Font Size (em)'), {
            target: { value: '2' },
        });
        fireEvent.change(screen.getByLabelText('Text Color'), {
            target: { value: '#0000FF' },
        });

        const saveChangesButton = screen.getByRole('button', { name: 'Save Changes' });
        fireEvent.click(saveChangesButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
        });

        const updatedTextElement = screen.getByText('Updated Text');
        expect(updatedTextElement).toBeInTheDocument();

        const updatedTextContainer = updatedTextElement.parentElement;
        expect(updatedTextContainer).toHaveStyle({
            width: '60%',
        });
        expect(updatedTextElement).toHaveStyle({
            'font-size': '2em',
            color: '#0000FF',
        });
    });
});