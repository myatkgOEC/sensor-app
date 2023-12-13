import { dateFns } from "./dateFns";

const {
  startOfHour,
  endOfHour,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachHourOfInterval,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isWithinInterval,
  parseISO,
} = dateFns;

function aggregateSensorData(sensorData, intervalType) {
  if (!sensorData || sensorData.length === 0) {
    return [];
  }

  const intervalFunctions = {
    hourly: {
      startFunc: startOfHour,
      endFunc: endOfHour,
      eachFunc: eachHourOfInterval,
    },
    daily: {
      startFunc: startOfDay,
      endFunc: endOfDay,
      eachFunc: eachDayOfInterval,
    },
    weekly: {
      startFunc: startOfWeek,
      endFunc: endOfWeek,
      eachFunc: eachWeekOfInterval,
    },
    monthly: {
      startFunc: startOfMonth,
      endFunc: endOfMonth,
      eachFunc: eachMonthOfInterval,
    },
  };

  const { startFunc, endFunc, eachFunc } = intervalFunctions[intervalType];
  const parsedData = sensorData?.map((d) => ({
    ...d,
    datetime: parseISO(d.datetime),
  }));
  const sortedData = parsedData.sort((a, b) => a.datetime - b.datetime);
  const startDate = startFunc(sortedData[0].datetime);
  const endDate = endFunc(sortedData[sortedData.length - 1].datetime);

  const aggregatedData = [];

  eachFunc({ start: startDate, end: endDate }).forEach((date) => {
    const startInterval = startFunc(date);
    const endInterval = endFunc(date);

    // console.log(
    //   `Aggregating from ${startInterval.toISOString()} to ${endInterval.toISOString()}`
    // );

    const filteredData = sortedData.filter((item) =>
      isWithinInterval(item.datetime, {
        start: startInterval,
        end: endInterval,
      })
    );

    // console.log(`Number of data points in interval: ${filteredData.length}`);

    if (filteredData.length > 0) {
      const aggregatedPoint = {
        datetime: startInterval.toISOString(),
      };

      Object.keys(filteredData[0]).forEach((property) => {
        if (property !== "datetime") {
          const values = filteredData?.map((item) => item[property].value);
          aggregatedPoint[property] = {
            ...filteredData[0][property], // Retain the style and label
          };
          aggregatedPoint[property].value =
            aggregatedPoint[property]?.aggregator === "sum"
              ? sum(values)
              : aggregatedPoint[property]?.aggregator === "median"
              ? median(values)
              : 0;
        }
      });

      aggregatedData.push(aggregatedPoint);
    }
  });

  return aggregatedData;
}

function average(values) {
  const sum = values.reduce((a, b) => a + b, 0);
  return values.length > 0 ? sum / values.length : 0;
}

function median(values) {
  if (values.length === 0) return 0;

  values.sort((a, b) => a - b);
  const half = Math.floor(values.length / 2);

  if (values.length % 2) {
    return values[half];
  }

  return (values[half - 1] + values[half]) / 2.0;
}

function sum(values) {
  return values.reduce((a, b) => a + b, 0);
}

export { aggregateSensorData };

// export function preprocessSensorData(sensorData) {
//   console.log({ sensorData });
//   // Create an index for quick lookups
//   const indexedSensorData = sensorData.reduce((acc, sensor) => {
//     sensor.forEach((data) => {
//       const date = new Date(data.datetime);
//       const year = date.getFullYear();
//       const month = date.getMonth(); // 0-indexed
//       const day = date.getDate();

//       if (!acc[year]) {
//         acc[year] = {};
//       }
//       if (!acc[year][month]) {
//         acc[year][month] = {};
//       }
//       if (!acc[year][month][day]) {
//         acc[year][month][day] = [];
//       }
//       acc[year][month][day].push(data);
//     });
//     return acc;
//   }, {});
//   console.log({ indexedSensorData });
//   return indexedSensorData;
// }

// export function filterDataForAggregation(
//   indexedSensorData,
//   selectedAggregation,
//   selectedDate
// ) {
//   const selectedDateObj = new Date(selectedDate);
//   const selectedYear = selectedDateObj.getFullYear();
//   const selectedMonth = selectedDateObj.getMonth();
//   const selectedDay = selectedDateObj.getDate();

//   switch (selectedAggregation.toLowerCase()) {
//     case "hourly":
//       return (
//         indexedSensorData[selectedYear]?.[selectedMonth]?.[selectedDay] || []
//       );
//     case "daily":
//       return Object.values(
//         indexedSensorData[selectedYear]?.[selectedMonth] || {}
//       ).flat();
//     case "weekly":
//       // Implement similar logic for weekly, considering getWeeksInLastFourMonths
//       break;
//     case "monthly":
//       const startYear = selectedYear - 1;
//       return Object.keys(indexedSensorData)
//         .filter((year) => year >= startYear && year <= selectedYear)
//         .flatMap((year) => Object.values(indexedSensorData[year]).flat(2));
//   }
// }
