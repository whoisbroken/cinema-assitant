import { useEffect, useState } from 'react';
import { format } from 'date-fns';

import { Session } from './types';
import { generateWeeklyMovieSessions, generateWeeklyUserSchedule, groupByDay } from './utils';
import styles from './App.module.css';


function App() {
  const [userSchedule, setUserSchedule] = useState<Session[]>([]);
  const [movieSessions, setMovieSessions] = useState<Session[]>([]);
  const [availableSessions, setAvailableSessions] = useState<Session[]>([]);

  useEffect(() => {
    setUserSchedule(generateWeeklyUserSchedule());
    setMovieSessions(generateWeeklyMovieSessions());
  }, []);

  const checkAvailability = () => {
    console.log(movieSessions, 'movieSessions');
    console.log(userSchedule, 'userSchedule');
    const freeSessions = movieSessions.filter((session) => {
      const sessionStart = new Date(session.start);
      const sessionEnd = new Date(session.end);

      const conflicts = userSchedule.some((meeting) => {
        const meetingStart = new Date(meeting.start);
        const meetingEnd = new Date(meeting.end);

        return meetingStart < sessionEnd && meetingEnd > sessionStart;
      });

      return !conflicts;
    });

    setAvailableSessions(freeSessions);
  };

  const groupedUserSchedule = groupByDay(userSchedule);
  const groupedMovieSessions = groupByDay(movieSessions);
  const groupedAvailableSessions = groupByDay(availableSessions);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎬 Cinema weekly assistant</h1>

      <div className={styles.grid}>
        <div className={styles.gridColumn}>
          <h2 className={styles.subtitle}>📅 Calendar</h2>
          {Object.entries(groupedUserSchedule).map(([day, events], i) => (
            <div key={i} className={styles.dayBlock}>
              <p className={styles.dayLabel}>{format(new Date(day), 'eeee, d MMMM')}</p>
              <div className={styles.cardList}>
                {events.map((event, idx) => (
                  <div key={idx} className={`${styles.card} ${styles.red}`}>
                    <p className={styles.cardTitle}>{event.title}</p>
                    <p>
                      {format(new Date(event.start), 'HH:mm')} – {format(new Date(event.end), 'HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.gridColumn}>
          <h2 className={styles.subtitle}>🎞️ Now in cinemas</h2>
          {Object.entries(groupedMovieSessions).map(([day, sessions], i) => (
            <div key={i} className={styles.dayBlock}>
              <p className={styles.dayLabel}>{format(new Date(day), 'eeee, d MMMM')}</p>
              <div className={styles.cardList}>
                {sessions.map((session, idx) => (
                  <div key={idx} className={`${styles.card} ${styles.blue}`}>
                    <p className={styles.cardTitle}>{session.title}</p>
                    <p>
                      {format(new Date(session.start), 'HH:mm')} - {format(new Date(session.end), 'HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.center}>
        <button className={styles.button} onClick={checkAvailability}>
          🔍 Select an available session
        </button>
      </div>

      <div>
        <h2 className={styles.subtitle}>✅ Available sessions</h2>
        {availableSessions.length > 0 ? (
          Object.entries(groupedAvailableSessions).map(([day, sessions], i) => (
            <div key={i} className={styles.dayBlock}>
              <p className={styles.dayLabel}>{format(new Date(day), 'eeee, d MMMM')}</p>
              <div className={styles.cardGrid}>
                {sessions.map((session, idx) => (
                  <div key={idx} className={`${styles.card} ${styles.green}`}>
                    <p className={styles.cardTitle}>{session.title}</p>
                    <p>
                      {format(new Date(session.start), 'HH:mm')} - {format(new Date(session.end), 'HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.emptyText}>There are no sessions available. 😢</p>
        )}
      </div>
    </div>
  );
}
export default App;
