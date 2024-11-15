import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../components/LoginPage';
import { vi } from 'vitest';
import { BrowserRouter, useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('LoginPage Component', () => {
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

  it('should log in successfully with correct credentials', async () => {
    const mockToken = 'mocked_token';
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: mockToken }),
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5005/admin/auth/login',
        expect.anything()
      );
    });

    expect(localStorage.getItem('token')).toEqual(mockToken);
    expect(navigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should display an error message when login fails', async () => {
    const mockError = 'Invalid email or password';
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: mockError }),
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText(mockError)).toBeInTheDocument();
    });

    expect(navigate).not.toHaveBeenCalled();

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should navigate back to the home page when "Back" button is clicked', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Back'));
    expect(navigate).toHaveBeenCalledWith('/');
  });
});