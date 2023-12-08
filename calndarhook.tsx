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
Now, the currentDate property is part of the returned object, and it holds the current date in the desired format. Feel free to test it, and if you have any more questions or adjustments, let me know!




User
Please take year as parameter and prepare months weeks array for whole year
ChatGPT
Certainly! I've modified the code to take the year as a parameter and prepare the monthsArray and weeksArray for the entire year.

jsx
Copy code
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/week';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(weekOfYear);
dayjs.extend(utc);
dayjs.extend(timezone);

const useMonthsAndWeeks = (year) => {
  const [monthsArray, setMonthsArray] = useState([]);
  const [weeksArray, setWeeksArray] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Generate months array for the whole year
    const generateMonthsArray = () => {
      const monthsArray = Array.from({ length: 12 }, (_, index) => {
        const monthDate = dayjs().year(year).month(index).startOf('month');
        return {
          monthIndex: index,
          monthName: monthDate.format('MMMM'),
          startDate: monthDate.format('YYYY-MM-DDTHH:mm:ssXXX'),
          endDate: monthDate.endOf('month').format('YYYY-MM-DDTHH:mm:ssXXX'),
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
  }, [year]);

  return { monthsArray, weeksArray, currentDate };
};

export default useMonthsAndWeeks;