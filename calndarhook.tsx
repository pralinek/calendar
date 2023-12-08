import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/week';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(weekOfYear);
dayjs.extend(timezone);
dayjs.extend(utc);

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
  monthIndex: number;
  weekMonthIndex: number;
  weekStartDate: string;
  weekEndDate: string;
  daysArray: DayObject[];
}

interface MonthsAndWeeksResult {
  currentDate: string;
  currentMonthObject: MonthObject;
  currentWeekObject: WeekObject;
  monthsArray: MonthObject[];
  weeksArray: WeekObject[];
}

const useMonthsAndWeeks = (currentYear: number, timezone: string): MonthsAndWeeksResult => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentMonthObject, setCurrentMonthObject] = useState<MonthObject | null>(null);
  const [currentWeekObject, setCurrentWeekObject] = useState<WeekObject | null>(null);
  const [monthsArray, setMonthsArray] = useState<MonthObject[]>([]);
  const [weeksArray, setWeeksArray] = useState<WeekObject[]>([]);

  useEffect(() => {
    // Get current date in the specified timezone
    const today = dayjs().tz(timezone);
    setCurrentDate(today.format('YYYY-MM-DD'));

    // Generate months array
    const generateMonthsArray = () => {
      const monthsArray: MonthObject[] = Array.from({ length: 12 }, (_, index) => {
        const monthDate = dayjs().tz(timezone).year(currentYear).month(index).startOf('month');
        return {
          monthIndex: index,
          monthName: monthDate.format('MMMM'),
          startDate: monthDate.format('YYYY-MM-DD'),
          endDate: monthDate.endOf('month').format('YYYY-MM-DD'),
        };
      });

      setMonthsArray(monthsArray);

      // Set current month object
      const currentMonth = today.month();
      const currentMonthObject = monthsArray.find((month) => month.monthIndex === currentMonth);
      if (currentMonthObject) {
        setCurrentMonthObject(currentMonthObject);
      }
    };

    // Generate weeks array with days
    const generateWeeksArray = () => {
      const weeksArray: WeekObject[] = [];

      // Loop through each month
      monthsArray.forEach((month) => {
        const startOfWeek = dayjs(month.startDate).tz(timezone).startOf('week');
        const endOfWeek = dayjs(month.endDate).tz(timezone).endOf('week');

        let currentWeekStart = startOfWeek;
        let weekMonthIndex = 0;

        // Loop through each week in the month
        while (currentWeekStart.isBefore(endOfWeek) || currentWeekStart.isSame(endOfWeek, 'day')) {
          const weekStartDate = currentWeekStart.startOf('week');
          const weekEndDate = weekStartDate.endOf('week');

          const daysArray: DayObject[] = Array.from({ length: 7 }, (_, dayIndex) => {
            const dayDate = weekStartDate.add(dayIndex, 'day');
            return {
              dayIndex,
              dayName: dayDate.format('dddd'),
              date: dayDate.format('YYYY-MM-DD'),
            };
          });

          weeksArray.push({
            monthIndex: month.monthIndex,
            weekMonthIndex,
            weekStartDate: weekStartDate.format('YYYY-MM-DD'),
            weekEndDate: weekEndDate.format('YYYY-MM-DD'),
            daysArray,
          });

          currentWeekStart = currentWeekStart.add(1, 'week');
          weekMonthIndex++;
        }
      });

      setWeeksArray(weeksArray);

      // Set current week object
      const currentWeekStart = today.startOf('week');
      const currentWeekObject = weeksArray.find(
        (week) =>
          week.monthIndex === today.month() && dayjs(week.weekStartDate).isSame(currentWeekStart, 'day')
      );
      if (currentWeekObject) {
        setCurrentWeekObject(currentWeekObject);
      }
    };

    // Call the functions to generate arrays
    generateMonthsArray();
    generateWeeksArray();
  }, [currentYear, monthsArray, timezone]);

  return { currentDate, currentMonthObject, currentWeekObject, monthsArray, weeksArray };
};

export default useMonthsAndWeeks;