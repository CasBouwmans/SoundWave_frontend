import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/app/page';

describe('App Component', () => {
  test('renders the logo', () => {
    render(<App />);
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });

  test('renders the SoundWave title', () => {
    render(<App />);
    const title = screen.getByText(/SoundWave/i);
    expect(title).toBeInTheDocument();
  });

  test('renders the login button when no token is present', () => {
    render(<App />);
    const loginButton = screen.getByText(/Login/i);
    expect(loginButton).toBeInTheDocument();
  });
});