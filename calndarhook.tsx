import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

interface DayObject {
  year: string;
  week: number;
  days: string[];
}

interface WeekObject {
  year: string;
  week: number;
  days: string[];
}

interface MonthObject {
  month: string;
  weeks: WeekObject[];
}

const useYearMonths = (year: number, timezone: string): MonthObject[] => {
  const [yearMonths, setYearMonths] = useState<MonthObject[]>([]);

  useEffect(() => {
    const generateYearMonths = () => {
      const startOfYear = dayjs(`${year}-01-01`).tz(timezone);
      const endOfYear = dayjs(`${year}-12-31`).tz(timezone);

      let currentMonth = startOfYear.clone();
      const months: MonthObject[] = [];

      while (currentMonth.isSameOrBefore(endOfYear, 'month')) {
        const monthObj: MonthObject = {
          month: currentMonth.format('MMMM'),
          weeks: [],
        };

        let currentWeek = currentMonth.startOf('month').isoWeekday(1);
        const weeks: WeekObject[] = [];

        while (currentWeek.isSameOrBefore(currentMonth.endOf('month'), 'week')) {
          const weekObj: WeekObject = {
            year: currentWeek.format('YYYY'),
            week: currentWeek.isoWeek(),
            days: [],
          };

          let currentDay = currentWeek.clone();
          const days: string[] = [];

          for (let i = 0; i < 7; i++) {
            days.push(currentDay.format('dddd'));
            currentDay = currentDay.add(1, 'day');
          }

          weekObj.days = days;
          weeks.push(weekObj);

          currentWeek = currentWeek.add(1, 'week');
        }

        monthObj.weeks = weeks;
        months.push(monthObj);

        currentMonth = currentMonth.add(1, 'month');
      }

      setYearMonths(months);
    };

    generateYearMonths();
  }, [year, timezone]);

  return yearMonths;
};

export default useYearMonths;
