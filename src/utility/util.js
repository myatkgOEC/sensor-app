/**
 * Generates a random value within a given range, with options to specify the type of value.
 *
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @param {Object} [options={}] - Options for value generation.
 * @param {boolean} [options.isFloat=false] - If true, returns a floating-point number; otherwise, returns an integer.
 * @returns {number} - A random number within the specified range.
 */
export function randomValue(min, max, options = {}) {
  const value = Math.random() * (max - min) + min;
  return options.isFloat ? Number(value.toFixed(2)) : Math.floor(value);
}

/**
 * Generates sensor data from a start date to the current date.
 *
 * @param {Date} startDate - The date from which to start generating data.
 * @param {Object} propertyRanges - An object specifying the keys and their value ranges and options for random generation.
 *                             Each key maps to an object with `range` and `options`.
 *                             Example:
 *                             ```javascript
 *                             {
 *                               temperature: { range: [20, 35], options: { isFloat: true } },
 *                               humidity: { range: [30, 70] }, // Default options (integer values)
 *                               kWh: { range: [1, 10] }        // Default options (integer values)
 *                             }
 *
 *                             ```
 * @returns {Object[]} - An array of sensor data objects. Each object contains a datetime and additional keys as specified in `propertyRanges`.
 *                       Example of returned data:
 *                       ```javascript
 *                       [
 *                         { datetime: '2022-01-01T00:00:00.000Z', temperature: 22.5, humidity: 65, kWh: 5 },
 *                         { datetime: '2022-01-01T00:30:00.000Z', temperature: 24.3, humidity: 60, kWh: 6 },
 *                         // ... more data points
 *                       ]
 *                       ```
 *
 * Example Usage:
 * ```javascript
 * const startDateTime = new Date('2022-01-01T00:00:00');
 * const propertyRanges = { temperature: [20, 35], humidity: [30, 70], kWh: [1, 10] };
 * const data = generateSensorData(startDateTime, propertyRanges);
 * console.log(data); // Prints sensor data starting from '2022-01-01T00:00:00' to now.
 * ```
 *
 * Time Complexity: O(n * m), where n is the number of time intervals (30 minutes each) from the start date to the current date,
 *                      and m is the number of keys in the propertyRanges object.
 * Space Complexity: O(n * m), as each data point is stored in the array,
 *                      and each data point contains m key-value pairs.
 */
export function generateSensorData(startDate, propertyRanges, sensorNo = 0) {
  const sensorData = [];
  let currentDatetime = startDate.getTime();
  const now = new Date().getTime();
  const thirtyMinutes = 30 * 60000;

  while (currentDatetime <= now) {
    const dataPoint = { datetime: new Date(currentDatetime).toISOString() };

    for (const [key, { range, options }] of Object.entries(propertyRanges)) {
      dataPoint[key] = {
        ...options, // Include any options that were provided in the propertyRanges object for this key. This allows the user to specify options for each key. Example: { range: [20, 35], options: { isFloat: true } } will set isFloat to true for the temperature key.
        value: randomValue(...range, options),
        chartStyle: options.chartStyle || {}, // Default to an empty object if no chartStyle is provided
        label: options.label || key, // Use a custom label if provided, else default to the key
        name: `Sensor_${sensorNo + 1}`,
      };
    }

    sensorData.push(dataPoint);
    currentDatetime += thirtyMinutes;
  }

  return sensorData;
}

/**
 * Generates sensor data for multiple sensors.
 * @param {number} numberOfSensors - The number of sensors to generate data for.
 * @param {Date} startDate - The start date for data generation.
 * @param {Object} propertyRanges - The ranges for each data point type.
 * @returns {Object[]} - An array containing sensor data for each sensor.
 */
export function generateDataForMultipleSensors(
  numberOfSensors,
  startDate,
  propertyRanges
) {
  const allSensorData = [];

  for (let i = 0; i < numberOfSensors; i++) {
    const sensorData = generateSensorData(startDate, propertyRanges, i);
    allSensorData.push(sensorData);
  }

  return allSensorData;
}

export function formatLabel(datetime, aggregation) {
  const date = new Date(datetime);
  switch (aggregation) {
    case "hourly":
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    case "daily":
      return date.toLocaleDateString();
    case "weekly":
      return `${date.toLocaleDateString()} - ${new Date(
        date.getTime() + 6 * 24 * 60 * 60 * 1000
      ).toLocaleDateString()}`;
    case "monthly":
      return date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
    default:
      return datetime;
  }
}
