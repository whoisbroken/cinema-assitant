import React from 'react';
import { format } from 'date-fns';

import { Session } from '../types';
import { CalendarType } from '../constant';
import styles from './CalendarDayCard.module.css';

interface CalendarDayCardProps {
  date: string;
  items: Session[];
  type: CalendarType;
}

const CalendarDayCard: React.FC<CalendarDayCardProps> = ({ date, items, type }) => {
  return (
    <div className={styles.card} data-type={type}>
      <h3 className={styles.cardTitle}>{format(new Date(date), 'eeee, d MMMM')}</h3>
      <ul>
        {items.map((item, idx) => (
          <li key={idx} className={styles.cardItem}>
            <p className={styles.cardTitle}>{item.title}</p>
            <p>
              {format(new Date(item.start), 'HH:mm')} - {format(new Date(item.end), 'HH:mm')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarDayCard;
