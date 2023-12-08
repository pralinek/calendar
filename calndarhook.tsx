import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/week';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(weekOfYear);
dayjs.extend(utc);
dayjs.extend(timezone);

interface MonthObject {
  monthIndex: number;
  monthName: string;
  startDate: string;
  endDate: string;
}

interface DayObject {
  dayIndex: number;
  dayName: string;
  date: string;
}

interface WeekObject {
  weekIndex: number;
  weekOfMonth: number;
  weekStartDate: string;
  weekEndDate: string;
  daysArray: DayObject[];
}

interface MonthsAndWeeksResult {
  monthsArray: MonthObject[];
  weeksArray: WeekObject[];
  currentDate: string;
}

const useMonthsAndWeeks = (year: number): MonthsAndWeeksResult => {
  const [monthsArray, setMonthsArray] = useState<MonthObject[]>([]);
  const [weeksArray, setWeeksArray] = useState<WeekObject[]>([]);
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    // Generate months array for the whole year
    const generateMonthsArray = () => {
      const monthsArray = Array.from({ length: 12 }, (_, index) => {
        const monthDate = dayjs().year(year).month(index).startOf('month');
        return {
          monthIndex: index,
          monthName: monthDate.format('MMMM'),
          startDate: monthDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          endDate: monthDate.endOf('month').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        };
      });

      setMonthsArray(monthsArray);
    };

    // Generate weeks array for the whole year
    const generateWeeksArray = () => {
      const startOfYear = dayjs().year(year).startOf('year');
      const endOfYear = dayjs().year(year).endOf('year');

      const startOfWeek = startOfYear.startOf('week'); // Set to Monday
      const endOfWeek = endOfYear.endOf('week'); // Set to Sunday

      const numberOfWeeks = endOfWeek.diff(startOfWeek, 'week') + 1;

      const weeksArray = Array.from({ length: numberOfWeeks }, (_, weekIndex) => {
        const weekStartDate = startOfWeek.add(weekIndex, 'week');
        const weekEndDate = weekStartDate.endOf('week');

        const daysArray = Array.from({ length: 7 }, (_, dayIndex) => {
          const dayDate = weekStartDate.add(dayIndex, 'day');
          return {
            dayIndex,
            dayName: dayDate.format('dddd'),
            date: dayDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          };
        });

        return {
          weekIndex,
          weekOfMonth: weekStartDate.date() > 1 ? weekStartDate.add(1, 'week').week() : weekStartDate.week(),
          weekStartDate: weekStartDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          weekEndDate: weekEndDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          daysArray,
        };
      });

      setWeeksArray(weeksArray);
    };

    // Set current date
    setCurrentDate(dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ'));

    // Call the functions to generate arrays
    generateMonthsArray();
    generateWeeksArray();
  }, [year]);

  return { monthsArray, weeksArray, currentDate };
};

export default useMonthsAndWeeks;