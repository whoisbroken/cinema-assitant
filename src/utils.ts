import { addDays, format, setHours, setMinutes, startOfToday } from 'date-fns';
import { Session } from './types';

export function generateWeeklyUserSchedule(): Session[] {
  const base = startOfToday();
  const schedule: Session[] = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(base, i);
    schedule.push(
      {
        title: 'Meeting',
        start: setHours(setMinutes(day, 0), 10).toISOString(),
        end: setHours(setMinutes(day, 0), 11).toISOString(),
      },
      {
        title: 'Meeting',
        start: setHours(setMinutes(day, 0), 14).toISOString(),
        end: setHours(setMinutes(day, 0), 15).toISOString(),
      },
    );
    if (i % 2 === 0) {
      schedule.push({
        title: 'Meeting',
        start: setHours(setMinutes(day, 0), 15).toISOString(),
        end: setHours(setMinutes(day, 0), 16).toISOString(),
      });
      schedule.push({
        title: 'Meeting',
        start: setHours(setMinutes(day, 0), 16).toISOString(),
        end: setHours(setMinutes(day, 0), 18).toISOString(),
      });
    }
  }
  return schedule;
}

export function generateWeeklyMovieSessions(): Session[] {
  const base = startOfToday();
  const sessions: Session[] = [];
  const dailyMovies = [
    { title: 'Dune 2', startHour: 11, endHour: 13 },
    { title: 'Oppenheimer', startHour: 14, endHour: 16 },
    { title: 'The Dark Knight', startHour: 17, endHour: 19 },
  ];

  for (let i = 0; i < 7; i++) {
    const day = addDays(base, i);
    dailyMovies.forEach(({ title, startHour, endHour }) => {
      sessions.push({
        title,
        start: setHours(setMinutes(day, 0), Math.floor(startHour)).toISOString(),
        end: setHours(setMinutes(day, 0), Math.floor(endHour)).toISOString(),
      });
    });
  }

  return sessions;
}

export function groupByDay(items: Session[]) {
  const grouped: { [key: string]: Session[] } = {};
  items.forEach((item) => {
    const day = format(new Date(item.start), 'yyyy-MM-dd');
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(item);
  });
  return grouped;
}
