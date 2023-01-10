import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';

const months = [
  'Total',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function Chart({ work }) {
  const [parsedDays, setparsedDays] = React.useState([]);
  const [totalMinutes, setTotalMinutes] = React.useState(0);
  const [parsedWeeks, setParsedWeeks] = React.useState([]);
  const [isDataSet, setIsDataSet] = React.useState(false);
  const [monthToView, setMonthToView] = React.useState(0);

  function getWeekNumber(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return Math.floor(day / 7) + 1;
  }

  React.useMemo(() => {
    const month = new Date().getMonth();
    setMonthToView(month + 1);
  }, []);

  React.useEffect(() => {
    setIsDataSet(false);
    if (work) {
      /** PER DAY */

      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

      const addMissingDays = (work) => {
        const modifiedWork = [];

        for (let i = 0; i < work.length; i++) {
          const currentWork = work[i];
          const previousWork = i > 0 ? work[i - 1] : null;

          if (previousWork) {
            const currentTimeStarted = new Date(currentWork.timeStarted);
            const previousTimeStarted = new Date(previousWork.timeStarted);

            if (currentTimeStarted > previousTimeStarted) {
              const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
              const numDays = Math.round(Math.abs((currentTimeStarted - previousTimeStarted) / oneDay));
              for (let j = 1; j < numDays; j++) {
                const missingTimeStarted = new Date(previousTimeStarted.getTime() + oneDay * j);
                const missingWork = {
                  timeStarted: missingTimeStarted.toISOString(),
                  minutes: 0,
                };
                modifiedWork.push(missingWork);
              }
            }
          }

          modifiedWork.push(currentWork);
        }

        return modifiedWork;
      };

      const modifiedWork = addMissingDays(work);

      const reducedDays = modifiedWork.reduce((acc, x) => {
        const timestamp = Date.parse(x.timeStarted);
        const date = new Date(timestamp);
        const dayOfWeek = daysOfWeek[date.getDay()];

        let dayObject = acc.find((item) => {
          return item.timeStarted === x.timeStarted.split('T')[0];
        });

        if (!dayObject) {
          dayObject = { dayOfWeek: dayOfWeek, timeStarted: x.timeStarted.split('T')[0], minutes: 0 };
          acc.push(dayObject);
        }

        dayObject.minutes += Number(x.minutes);
        return acc;
      }, []);

      if (reducedDays.length > 0) {
        reducedDays.sort((a, b) => daysOfWeek.indexOf(a.timeStarted) - daysOfWeek.indexOf(b.timeStarted));
      }

      /** TOTAL MINUTES */

      const totalMinutes = reducedDays.reduce((acc, x) => acc + x.minutes, 0);
      setTotalMinutes(totalMinutes);

      /** PER MONTH */

      if (monthToView !== 0) {
        const daysPerMonth = reducedDays.filter((day) => {
          const timestamp = Date.parse(day.timeStarted);
          const date = new Date(timestamp);
          const month = date.getMonth();

          return month + 1 === monthToView;
        });
        if (daysPerMonth?.length > 0) {
          daysPerMonth.sort((a, b) => daysOfWeek.indexOf(a.timeStarted) - daysOfWeek.indexOf(b.timeStarted));
          setparsedDays(daysPerMonth);
        } else {
          setparsedDays([]);
        }
      } else {
        setparsedDays(reducedDays);
      }

      /** PER WEEK */

      const reducedWeeks = work.reduce((acc, x) => {
        const date = new Date(x.timeStarted);
        const week = getWeekNumber(date);
        const month = date.getMonth();

        let weekObject = acc.find((item) => item.week === week);

        if (!weekObject) {
          weekObject = { week: week, month: month, minutes: 0 };
          acc.push(weekObject);
        }
        weekObject.minutes += Number(x.minutes);
        return acc;
      }, []);

      // setParsedWeeks(reducedWeeks);

      if (monthToView !== 0) {
        const weeksPerMonth = reducedWeeks.filter((week) => {
          return week.month + 1 === monthToView;
        });
        if (weeksPerMonth?.length > 0) {
          setParsedWeeks(weeksPerMonth);
        } else {
          setParsedWeeks([]);
        }
      } else {
        setParsedWeeks(reducedWeeks);
      }

      setIsDataSet(true);
    }
  }, [work, monthToView]);

  if (!isDataSet) return <p>Loading...</p>;
  return (
    <>
      <h1>Total Deep Work Hours: {(totalMinutes / 60).toFixed(2)}</h1>
      {/* create a dropdown */}
      <select
        value={monthToView}
        onChange={(e) => {
          setMonthToView(Number(e.target.value));
        }}
      >
        <option value={0}>Total</option>
        <option value={1}>January</option>
        <option value={2}>February</option>
        <option value={3}>March</option>
        <option value={4}>April</option>
        <option value={5}>May</option>
        <option value={6}>June</option>
        <option value={7}>July</option>
        <option value={8}>August</option>
        <option value={9}>September</option>
        <option value={10}>October</option>
        <option value={11}>November</option>
        <option value={12}>December</option>
      </select>

      {isDataSet && (
        <>
          <h2>Total Minutes per Day {`(${months[monthToView]})`}</h2>
          <LineChart width={1000} height={700} data={parsedDays} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='timeStarted'>
              <Label value='Date' offset={10} position='bottom' />
            </XAxis>

            <YAxis dataKey='minutes'>
              <Label value='Minutes' angle={-90} position='insideLeft' />
            </YAxis>
            <Tooltip />
            {/* <Legend /> */}
            <Line dataKey='minutes' stroke='#8884d8' />
          </LineChart>
          <br />

          <h2>Total Minutes per Week {`(${months[monthToView]})`}</h2>
          <BarChart width={1000} height={700} data={parsedWeeks} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='week'>
              <Label value='# of Week (per Year) ' offset={10} position='bottom' />
            </XAxis>
            <YAxis dataKey='minutes'>
              <Label value='Minutes' angle={-90} position='insideLeft' />
            </YAxis>
            <Tooltip />
            {/* <Legend /> */}
            <Bar dataKey='minutes' fill='#8884d8' />
          </BarChart>
        </>
      )}
    </>
  );
}

export default Chart;
