function range(start, stop, step) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step
  );
}

function sameDay(d1, d2) {
  d1 = new Date(d1);
  d2 = new Date(d2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// Add a `number` of days to `date`.
function addDays(date, number) {
  const newDate = new Date(date);
  return new Date(newDate.setDate(newDate.getDate() + number));
}

// Returns the `nth` `day` for a given `month`.
// nth is 0-indexed, Days are 1-indexed, months are 0-indexed.
// Example: To query the third Friday for February, call with:
//   `getNthDayForMonth(2, 5, 1)
function getNthDayForMonth(nth, day, month) {
  d = new Date();
  d.setDate(1);
  d.setMonth(month);

  month = d.getMonth();
  days = [];

  // Get the first `day` in the `month`
  while (d.getDay() !== day) {
    d.setDate(d.getDate() + 1);
  }

  // Get all the other days in the `month`
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }

  return days[nth];
}

function formatDate(date, options) {
  date.setHours(options.hours);
  date.setMinutes(options.minute);
  return new Intl.DateTimeFormat(options.locale, {
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}

// public function to call from the LP
function populateSchedule({ nthDay, months, firstDay, secondDay, exceptions, numberOfResults }) {
  cur = new Date().getMonth();

  // 1. For the next 5 years...
  const dates = range(cur, cur + 60, 1)
    // 2. Filter only the months that are relevant for this schedule...
    .filter((e) => {
      return months[e % 12];
    })
    // 3. Get startDay/endDay and format them...
    .map((e) => {
      // 3a. Get the third (2) Friday (5) of the month (e)...
      startDay = getNthDayForMonth(nthDay, firstDay.day, e);
      // 3b. as well as two days from `startDay`.
      endDay = addDays(startDay, secondDay.daysLater);
      return [startDay, endDay];
    })
    // 4. Skip a date if the `startDate` is already in the past
    .filter((e) => {
      return e[0] > new Date();
    })
    // 5. Take care of exceptions. Special dates can be overriden.
    .map((e) => {
      // If there are any exceptions configured
      if (exceptions && exceptions.length) {
        // Check the current date against all exceptions.
        return exceptions.map((exception) => {
          // If the exception doesn't apply, don't change anything.
          if (!sameDay(e[0], exception.regularStart)) {
            return e;
          } else {
            var { startDay, endDay } = exception;
            // Otherwise replace the date with the exception config.
            return [new Date(startDay), new Date(endDay)];
          }
        })[0];
      } else {
        return e;
      }
    })
    // 6. Format the dates
    .map((e) => {
      return [formatDate(e[0], firstDay), formatDate(e[1], secondDay)];
    })
    // 7. And finally only use the first 5 results for the schedule.
    .slice(0, numberOfResults);

  return dates;
}

// function renderDates(dates) {
//   const dates = populateSchedule();

//   // Render the actual schedule in html
//   dates.forEach((d) => {
//     jQuery("#schedule tbody").append(
//       jQuery(`<tr><td>${d[0]}</td><td>${d[1]}</td></tr>`)
//     );
//   });
// }

module.exports = { populateSchedule };
