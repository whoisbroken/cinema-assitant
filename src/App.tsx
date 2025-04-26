import { useEffect, useMemo, useState } from 'react';

import CalendarDayCard from './components/CalendarDayCard';

import { Session } from './types';
import { CalendarType } from './constant';
import {
  calculateAvailableSessions,
  generateWeeklyMovieSessions,
  generateWeeklyUserSchedule,
  groupByDay,
} from './utils';
import styles from './App.module.css';

const App: React.FC = () => {
  const [userSchedule, setUserSchedule] = useState<Session[]>([]);
  const [movieSessions, setMovieSessions] = useState<Session[]>([]);
  const [availableSessions, setAvailableSessions] = useState<Session[]>([]);

  useEffect(() => {
    setUserSchedule(generateWeeklyUserSchedule());
    setMovieSessions(generateWeeklyMovieSessions());
  }, []);

  const checkAvailability = () => {
    const availableSessions = calculateAvailableSessions(movieSessions, userSchedule);

    setAvailableSessions(availableSessions);
  };

  const groupedUserSchedule = useMemo(() => groupByDay(userSchedule), [userSchedule]);
  const groupedMovieSessions = useMemo(() => groupByDay(movieSessions), [movieSessions]);
  const groupedAvailableSessions = useMemo(() => groupByDay(availableSessions), [availableSessions]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎬 Cinema weekly assistant</h1>
      <div>
        <button className={styles.button} onClick={checkAvailability}>
          🔍 Select an available session
        </button>
      </div>
      <div className={styles.grid}>
        <div className={styles.gridColumn}>
          <h2 className={styles.subtitle}>📅 Calendar</h2>
          {Object.entries(groupedUserSchedule).map(([day, items]) => (
            <CalendarDayCard key={day} date={day} items={items} type={CalendarType.SCHEDULE} />
          ))}
        </div>

        <div className={styles.gridColumn}>
          <h2 className={styles.subtitle}>🎞️ Now in cinemas</h2>
          {Object.entries(groupedMovieSessions).map(([day, items]) => (
            <CalendarDayCard key={day} date={day} items={items} type={CalendarType.SESSION} />
          ))}
        </div>

        <div className={styles.gridColumn}>
          <h2 className={styles.subtitle}>✅ Available sessions</h2>
          {availableSessions.length > 0 ? (
            Object.entries(groupedAvailableSessions).map(([day, items]) => (
              <CalendarDayCard key={day} date={day} items={items} type={CalendarType.AVAILABLE} />
            ))
          ) : (
            <p className={styles.emptyText}>There are no sessions available. 😢</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
