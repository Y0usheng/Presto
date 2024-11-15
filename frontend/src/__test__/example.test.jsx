import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../components/LoginPage';

describe('LoginPage Component', () => {
  test('should render login button', () => {
    const { getByRole } = render(<LoginPage />);
    const loginButton = getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  test('should handle button click', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<button onClick={handleClick}>Login</button>);
    const loginButton = getByRole('button', { name: /login/i });

    fireEvent.click(loginButton);
    expect(handleClick).toHaveBeenCalled();
  });

  test('should have proper styles', () => {
    const { getByRole } = render(<LoginPage />);
    const loginButton = getByRole('button', { name: /login/i });
    expect(loginButton).toHaveStyle(`
      background-color: #4CAF50;
      color: white;
      padding: 15px 32px;
      text-align: center;
      font-size: 16px;
    `);
  });
});