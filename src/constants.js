export const defaultSettings = {
  startDate: new Date("2023-12-01T00:00:00"),
  numberOfSensors: 5,
  propertyRanges: {
    temperature: {
      range: [-70, 70],
      options: {
        isFloat: true,
        chartStyle: {
          type: "line",
          fill: false,
        },
        label: "Temperature (°C)",
        aggregator: "median",
      },
    },
    humidity: {
      range: [0, 100],
      options: {
        chartStyle: { type: "line", fill: false },
        label: "Humidity (%)",
        aggregator: "median",
      },
    },
    kWh: {
      range: [0, 5],
      options: {
        chartStyle: { type: "bar", fill: true },
        label: "kWh",
        aggregator: "sum",
      },
    },
  },
};
