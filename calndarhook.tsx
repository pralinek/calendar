import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/week';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(weekOfYear);
dayjs.extend(utc);
dayjs.extend(timezone);

const useMonthsAndWeeks = (selectedMonthObject) => {
  const [monthsArray, setMonthsArray] = useState([]);
  const [weeksArray, setWeeksArray] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    if (!selectedMonthObject) return;

    // Generate months array
    const generateMonthsArray = () => {
      const { monthIndex, startDate, endDate } = selectedMonthObject;
      const currentYear = dayjs(startDate).year();

      const monthsArray = Array.from({ length: 12 }, (_, index) => {
        const monthDate = dayjs().year(currentYear).month(index).startOf('month');
        return {
          monthIndex: index,
          monthName: monthDate.format('MMMM'),
          startDate: monthDate.format('YYYY-MM-DDTHH:mm:ssXXX'),
          endDate: monthDate.endOf('month').format('YYYY-MM-DDTHH:mm:ssXXX'),
        };
      });

      setMonthsArray(monthsArray);
    };

    // Generate weeks array
    const generateWeeksArray = () => {
      const { startDate, endDate } = selectedMonthObject;

      const startOfWeek = dayjs(startDate).startOf('week'); // Set to Monday
      const endOfWeek = dayjs(endDate).endOf('week'); // Set to Sunday

      const numberOfWeeks = endOfWeek.diff(startOfWeek, 'week') + 1;

      const weeksArray = Array.from({ length: numberOfWeeks }, (_, weekIndex) => {
        const weekStartDate = startOfWeek.add(weekIndex, 'week');
        const weekEndDate = weekStartDate.endOf('week');

        const daysArray = Array.from({ length: 7 }, (_, dayIndex) => {
          const dayDate = weekStartDate.add(dayIndex, 'day');
          return {
            dayIndex,
            dayName: dayDate.format('dddd'),
            date: dayDate.format('YYYY-MM-DDTHH:mm:ssXXX'),
          };
        });

        return {
          weekIndex,
          weekStartDate: weekStartDate.format('YYYY-MM-DDTHH:mm:ssXXX'),
          weekEndDate: weekEndDate.format('YYYY-MM-DDTHH:mm:ssXXX'),
          daysArray,
        };
      });

      setWeeksArray(weeksArray);
    };

    // Set current date
    setCurrentDate(dayjs().format('YYYY-MM-DDTHH:mm:ssXXX'));

    // Call the functions to generate arrays
    generateMonthsArray();
    generateWeeksArray();
  }, [selectedMonthObject]);

  return { monthsArray, weeksArray, currentDate };
};

export default useMonthsAndWeeks;