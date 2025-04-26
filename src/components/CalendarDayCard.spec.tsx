import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { CalendarType } from '../constant';
import CalendarDayCard from './CalendarDayCard';

describe('CalendarDayCard', () => {
  const mockItems = [
    {
      title: 'Meeting with team',
      start: new Date('2025-04-28T10:00:00').toISOString(),
      end: new Date('2025-04-28T11:00:00').toISOString(),
    },
    {
      title: 'Lunch',
      start: new Date('2025-04-28T12:00:00').toISOString(),
      end: new Date('2025-04-28T13:00:00').toISOString(),
    },
  ];

  it('should render all items passed to it', () => {
    render(<CalendarDayCard date="2025-04-28" items={mockItems} type={CalendarType.SCHEDULE} />);

    expect(screen.getByText(/Meeting with team/i)).toBeInTheDocument();
    expect(screen.getByText(/Lunch/i)).toBeInTheDocument();
  });

  it('should display session time correctly', () => {
    render(<CalendarDayCard date="2025-04-28" items={mockItems} type={CalendarType.SCHEDULE} />);

    expect(screen.getByText(/10:00 - 11:00/)).toBeInTheDocument();
    expect(screen.getByText(/12:00 - 13:00/)).toBeInTheDocument();
  });
});
