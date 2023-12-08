import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/week';
import utc from 'dayjs/plugin/utc';

dayjs.extend(weekOfYear);
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
  monthsArray: MonthObject[];
  weeksArray: WeekObject[];
}

const useMonthsAndWeeks = (currentYear: number): MonthsAndWeeksResult => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [monthsArray, setMonthsArray] = useState<MonthObject[]>([]);
  const [weeksArray, setWeeksArray] = useState<WeekObject[]>([]);

  useEffect(() => {
    // Get current date
    const today = dayjs().utc();
    setCurrentDate(today.format('YYYY-MM-DD'));

    // Generate months array
    const generateMonthsArray = () => {
      const monthsArray: MonthObject[] = Array.from({ length: 12 }, (_, index) => {
        const monthDate = dayjs().utc().year(currentYear).month(index).startOf('month');
        return {
          monthIndex: index,
          monthName: monthDate.format('MMMM'),
          startDate: monthDate.format('YYYY-MM-DD'),
          endDate: monthDate.endOf('month').format('YYYY-MM-DD'),
        };
      });

      setMonthsArray(monthsArray);
    };

    // Generate weeks array with days
    const generateWeeksArray = () => {
      const weeksArray: WeekObject[] = [];

      // Loop through each month
      monthsArray.forEach((month) => {
        const startOfWeek = dayjs(month.startDate).utc().startOf('isoWeek');
        const endOfWeek = dayjs(month.endDate).utc().endOf('isoWeek');

        let currentWeekStart = startOfWeek;
        let weekMonthIndex = 0;

        // Loop through each week in the month
        while (currentWeekStart.isBefore(endOfWeek) || currentWeekStart.isSame(endOfWeek, 'day')) {
          const weekStartDate = currentWeekStart.startOf('isoWeek');
          const weekEndDate = weekStartDate.endOf('isoWeek');

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

          currentWeekStart = currentWeekStart.add(1, 'isoWeek');
          weekMonthIndex++;
        }
      });

      setWeeksArray(weeksArray);
    };

    // Call the functions to generate arrays
    generateMonthsArray();
    generateWeeksArray();
  }, [currentYear]);

  return { currentDate, monthsArray, weeksArray };
};

export default useMonthsAndWeeks;
