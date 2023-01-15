const { populateSchedule } = require("./index.js");

describe("populateSchedule", () => {
  test("for every third Friday of the month starting at 10 am until Sunday at 3 pm", () => {
    const dates = populateSchedule({
      // Get the third Friday of the month - and the second day three days later.
      nthDay: 2,
      firstDay: { day: 5, hours: 10, minute: 0, locale: "en-US" },
      secondDay: { daysLater: 2, hours: 15, minute: 0, locale: "en-US" },
      // All twelve months are relevant
      months: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      numberOfResults: 5
    });
    expect([
      ["Fri, 1/20/2023, 10:00 AM", "Sun, 1/22/2023, 3:00 PM"],
      ["Fri, 2/17/2023, 10:00 AM", "Sun, 2/19/2023, 3:00 PM"],
      ["Fri, 3/17/2023, 10:00 AM", "Sun, 3/19/2023, 3:00 PM"],
      ["Fri, 4/21/2023, 10:00 AM", "Sun, 4/23/2023, 3:00 PM"],
      ["Fri, 5/19/2023, 10:00 AM", "Sun, 5/21/2023, 3:00 PM"],
    ]).toEqual(dates);
  });

  test("for the first weeks of May and August", () => {
    const dates = populateSchedule({
      // Get the first Monday of the month - and the second day six days later.
      nthDay: 0,
      firstDay: { day: 1, hours: 19, minute: 0, locale: "en-US" },
      secondDay: { daysLater: 6, hours: 11, minute: 0, locale: "en-US" },
      // May and August are relevant
      months: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
      ],
      numberOfResults: 5
    });
    expect([
      ["Mon, 5/1/2023, 7:00 PM", "Sun, 5/7/2023, 11:00 AM"],
      ["Mon, 8/7/2023, 7:00 PM", "Sun, 8/13/2023, 11:00 AM"],
      ["Mon, 5/6/2024, 7:00 PM", "Sun, 5/12/2024, 11:00 AM"],
      ["Mon, 8/5/2024, 7:00 PM", "Sun, 8/11/2024, 11:00 AM"],
      ["Mon, 5/5/2025, 7:00 PM", "Sun, 5/11/2025, 11:00 AM"],
    ]).toEqual(dates);
  });

  test("for the first weeks of May and August - but overrule a specific instance", () => {
    const dates = populateSchedule({
      // Get the first Monday of the month - and the second day six days later.
      nthDay: 0,
      firstDay: { day: 1, hours: 19, minute: 0, locale: "en-US" },
      secondDay: { daysLater: 6, hours: 11, minute: 0, locale: "en-US" },
      // May and August are relevant
      months: [
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
      ],
      numberOfResults: 5,
      exceptions: [
        // The pilgrim retreat and the monthly retreat would
        // only be 5 days apart.
        {
          regularStart: "2023-08-07",
          startDay: "2023-07-31",
          endDay: "2023-08-06",
        },
      ],
    });
    expect([
      ["Mon, 5/1/2023, 7:00 PM", "Sun, 5/7/2023, 11:00 AM"],
      ["Mon, 7/31/2023, 7:00 PM", "Sun, 8/6/2023, 11:00 AM"],
      ["Mon, 5/6/2024, 7:00 PM", "Sun, 5/12/2024, 11:00 AM"],
      ["Mon, 8/5/2024, 7:00 PM", "Sun, 8/11/2024, 11:00 AM"],
      ["Mon, 5/5/2025, 7:00 PM", "Sun, 5/11/2025, 11:00 AM"],
    ]).toEqual(dates);
  });
});
