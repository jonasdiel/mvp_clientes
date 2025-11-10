import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should redirect to login page by default', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // The login page should be rendered - look for the login button and email field
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/seu@email.com/i)).toBeInTheDocument();
  });
});
