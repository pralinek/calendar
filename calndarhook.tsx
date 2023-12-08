import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

interface DayObject {
  dayIndex: number;
  dayName: string;
  startDate: string;
  endDate: string;
}

interface WeekObject {
  year: string;
  week: number;
  days: DayObject[];
  startOfWeek: string;
  endOfWeek: string;
}

interface MonthObject {
  month: string;
  weeks: WeekObject[];
  startOfMonth: string;
  endOfMonth: string;
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
          startOfMonth: currentMonth.startOf('month').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          endOfMonth: currentMonth.endOf('month').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        };

        let currentWeek = currentMonth.startOf('month').isoWeekday(1);
        const weeks: WeekObject[] = [];

        while (currentWeek.isSameOrBefore(currentMonth.endOf('month'), 'week')) {
          const weekObj: WeekObject = {
            year: currentWeek.format('YYYY'),
            week: currentWeek.isoWeek(),
            days: [],
            startOfWeek: currentWeek.startOf('isoWeek').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            endOfWeek: currentWeek.endOf('isoWeek').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          };

          let currentDay = currentWeek.clone();
          const days: DayObject[] = [];

          for (let i = 0; i < 7; i++) {
            const dayObj: DayObject = {
              dayIndex: i,
              dayName: currentDay.format('dddd'),
              startDate: currentDay.startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
              endDate: currentDay.endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            };

            days.push(dayObj);
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
