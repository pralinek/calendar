import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

interface DayObject {
  dayName: string;
  date: string;
}

interface MonthObject {
  monthIndex: number;
  monthName: string;
  startDate: string;
  endDate: string;
  timezone: string;
}

interface WeekObject {
  weekIndex: number;
  monthWeekIndex: number;
  startDate: string;
  endDate: string;
  timezone: string;
  days: DayObject[];
}

interface MonthsAndWeeksResult {
  currentDate: string;
  monthsArray: MonthObject[];
  weeksArray: WeekObject[];
}

const useMonthsAndWeeks = (currentYear: number, timezone: string): MonthsAndWeeksResult => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [monthsArray, setMonthsArray] = useState<MonthObject[]>([]);
  const [weeksArray, setWeeksArray] = useState<WeekObject[]>([]);

  useEffect(() => {
    const today = dayjs().tz(timezone);
    setCurrentDate(today.format('YYYY-MM-DDTHH:mm:ss.SSSZ'));

    const monthsArray: MonthObject[] = Array.from({ length: 12 }, (_, index) => {
      const monthDate = dayjs().tz(timezone).year(currentYear).month(index).startOf('month');
      return {
        monthIndex: index,
        monthName: monthDate.format('MMMM'),
        startDate: monthDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        endDate: monthDate.endOf('month').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        timezone: timezone,
      };
    });

    setMonthsArray(monthsArray);

    const weeksArray: WeekObject[] = Array.from({ length: 52 }, (_, index) => {
      const weekStartDate = dayjs().tz(timezone).year(currentYear).week(index).startOf('week');
      const weekEndDate = weekStartDate.endOf('week');
      const monthWeekIndex = weekStartDate.week() - weekStartDate.startOf('month').week() + 1;
      const days = Array.from({ length: 7 }, (_, dayIndex) => {
        const dayDate = weekStartDate.add(dayIndex, 'day');
        return {
          dayName: dayDate.format('dddd'),
          date: dayDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        };
      });
      return {
        weekIndex: index,
        monthWeekIndex: monthWeekIndex,
        startDate: weekStartDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        endDate: weekEndDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        timezone: timezone,
        days: days,
      };
    });

    setWeeksArray(weeksArray);
  }, [currentYear, timezone]);

  return { currentDate, monthsArray, weeksArray };
};

export default useMonthsAndWeeks;