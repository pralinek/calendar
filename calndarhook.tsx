import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/week';

dayjs.extend(weekOfYear);

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
  weekStartDate: string;
  weekEndDate: string;
  daysArray: DayObject[];
}

interface MonthsAndWeeksResult {
  monthsArray: MonthObject[];
  weeksArray: WeekObject[];
}

const useMonthsAndWeeks = (currentYear: number): MonthsAndWeeksResult => {
  const [monthsArray, setMonthsArray] = useState<MonthObject[]>([]);
  const [weeksArray, setWeeksArray] = useState<WeekObject[]>([]);

  useEffect(() => {
    // Generate months array
    const generateMonthsArray = () => {
      const monthsArray: MonthObject[] = Array.from({ length: 12 }, (_, index) => {
        const monthDate = dayjs().year(currentYear).month(index).startOf('month');
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
        const startOfWeek = dayjs(month.startDate).startOf('week');
        const endOfWeek = dayjs(month.endDate).endOf('week');

        let currentWeekStart = startOfWeek;

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
            weekStartDate: weekStartDate.format('YYYY-MM-DD'),
            weekEndDate: weekEndDate.format('YYYY-MM-DD'),
            daysArray,
          });

          currentWeekStart = currentWeekStart.add(1, 'week');
        }
      });

      setWeeksArray(weeksArray);
    };

    // Call the functions to generate arrays
    generateMonthsArray();
    generateWeeksArray();
  }, [currentYear, monthsArray]);

  return { monthsArray, weeksArray };
};

export default useMonthsAndWeeks;