import { describe, it, expect } from 'vitest';
import { format } from 'date-fns';

import {
  generateWeeklyMovieSessions,
  generateWeeklyUserSchedule,
  groupByDay,
  calculateAvailableSessions,
} from './utils';
import { Session } from './types';

describe('generateWeeklyUserSchedule', () => {
  it('generates 7 days of user schedule with 2-4 meetings each day', () => {
    const schedule = generateWeeklyUserSchedule();

    expect(schedule.length).toBeGreaterThanOrEqual(14);
    expect(schedule.length).toBeLessThanOrEqual(22);
  });
});

describe('generateWeeklyMovieSessions', () => {
  it('generates movie sessions for 7 days with 3 sessions each day', () => {
    const sessions = generateWeeklyMovieSessions();
    expect(sessions.length).toBe(21);
  });
});

describe('groupByDay', () => {
  it('groups sessions by yyyy-MM-dd format', () => {
    const date = new Date();
    const formattedDay = format(date, 'yyyy-MM-dd');

    const sessions = [
      {
        title: 'Dune',
        start: date.toISOString(),
        end: date.toISOString(),
      },
    ];

    const grouped = groupByDay(sessions);
    expect(grouped[formattedDay].length).toBe(1);
    expect(grouped[formattedDay][0].title).toBe('Dune');
  });

  describe('calculateAvailableSessions', () => {
    it('should return available sessions that do not conflict with user schedule', () => {
      const movieSessions = [
        {
          title: 'Avatar 2',
          start: new Date('2025-04-28T14:00:00').toISOString(),
          end: new Date('2025-04-28T16:00:00').toISOString(),
        },
        {
          title: 'Dune 2',
          start: new Date('2025-04-28T18:00:00').toISOString(),
          end: new Date('2025-04-28T20:00:00').toISOString(),
        },
      ];

      const userSchedule = [
        {
          title: 'Meeting',
          start: new Date('2025-04-28T15:00:00').toISOString(),
          end: new Date('2025-04-28T17:00:00').toISOString(),
        },
      ];

      const available = calculateAvailableSessions(movieSessions, userSchedule);

      expect(available).toHaveLength(1);
      expect(available[0].title).toBe('Dune 2');
    });

    it('should return empty array when all sessions conflict with user schedule', () => {
      const movieSessions = [
        {
          title: 'Avatar 2',
          start: new Date('2025-04-28T14:00:00').toISOString(),
          end: new Date('2025-04-28T16:00:00').toISOString(),
        },
      ];

      const userSchedule = [
        {
          title: 'Meeting',
          start: new Date('2025-04-28T13:00:00').toISOString(),
          end: new Date('2025-04-28T17:00:00').toISOString(),
        },
      ];

      const available = calculateAvailableSessions(movieSessions, userSchedule);

      expect(available).toHaveLength(0);
    });

    it('should return all sessions if no conflicts', () => {
      const movieSessions = [
        {
          title: 'Avatar 2',
          start: new Date('2025-04-28T14:00:00').toISOString(),
          end: new Date('2025-04-28T16:00:00').toISOString(),
        },
        {
          title: 'Dune 2',
          start: new Date('2025-04-28T18:00:00').toISOString(),
          end: new Date('2025-04-28T20:00:00').toISOString(),
        },
      ];

      const userSchedule: Session[] = [];

      const available = calculateAvailableSessions(movieSessions, userSchedule);

      expect(available).toHaveLength(2);
      expect(available.map((s) => s.title)).toEqual(['Avatar 2', 'Dune 2']);
    });
  });
});
