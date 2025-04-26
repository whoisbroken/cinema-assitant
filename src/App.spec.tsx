import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { CalendarType } from './constant';

import App from './App';

describe('App Component', () => {
  it('renders all sections correctly', () => {
    render(<App />);

    expect(screen.getByText(/Cinema weekly assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/Calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/Now in cinemas/i)).toBeInTheDocument();
    expect(screen.getByText(/Select an available session/i)).toBeInTheDocument();
    expect(screen.getByText(/There are no sessions available./i)).toBeInTheDocument();
  });

  it('renders correct available sessions that do not overlap with user schedule', async () => {
    render(<App />);

    const button = screen.getByText(/Select an available session/i);
    fireEvent.click(button);

    await waitFor(() => {
      const availableCards = screen.getAllByTestId(CalendarType.AVAILABLE);

      expect(availableCards.length).toBeGreaterThan(0);
    });
  });
});
