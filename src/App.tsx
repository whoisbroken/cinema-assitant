import { useEffect, useState } from 'react';
import { format } from 'date-fns';

import { Session } from './types';
import { generateWeeklyMovieSessions, generateWeeklyUserSchedule, groupByDay } from './utils';

function App() {
  const [userSchedule, setUserSchedule] = useState<Session[]>([]);
  const [movieSessions, setMovieSessions] = useState<Session[]>([]);
  const [availableSessions, setAvailableSessions] = useState<Session[]>([]);

  useEffect(() => {
    setUserSchedule(generateWeeklyUserSchedule());
    setMovieSessions(generateWeeklyMovieSessions());
  }, []);

  const checkAvailability = () => {
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
    <div>
      <h1>Cinema weekly assistant</h1>

      <div>
        <div>
          <h2>Calendar</h2>
          {Object.entries(groupedUserSchedule).map(([day, events], i) => (
            <div key={i}>
              <p>{format(new Date(day), 'eeee, d MMMM')}</p>
              <div>
                {events.map((event, idx) => (
                  <div key={idx}>
                    <p>{event.title}</p>
                    <p>
                      {format(new Date(event.start), 'HH:mm')} – {format(new Date(event.end), 'HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2>🎞️ Now in cinemas</h2>
          {Object.entries(groupedMovieSessions).map(([day, sessions], i) => (
            <div key={i}>
              <p>{format(new Date(day), 'eeee, d MMMM')}</p>
              <div>
                {sessions.map((session, idx) => (
                  <div key={idx}>
                    <p>{session.title}</p>
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

      <div>
        <button onClick={checkAvailability}>Select an available session</button>
      </div>

      <div>
        <h2>Available sessions</h2>
        {availableSessions.length > 0 ? (
          Object.entries(groupedAvailableSessions).map(([day, sessions], i) => (
            <div key={i}>
              <p>{format(new Date(day), 'eeee, d MMMM')}</p>
              <div>
                {sessions.map((session, idx) => (
                  <div key={idx}>
                    <p>{session.title}</p>
                    <p>
                      {format(new Date(session.start), 'HH:mm')} - {format(new Date(session.end), 'HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>There are no sessions available.</p>
        )}
      </div>
    </div>
  );
}

export default App;
