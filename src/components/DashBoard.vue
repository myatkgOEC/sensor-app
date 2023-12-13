<template>
  <div>
    <v-card class="ma-2 px-5 pb-0">
      <v-row class="d-flex justify-center my-6">
        <v-col sm="6" md="2">
          <v-select
            v-model="selectedAggregation"
            :items="['Hourly', 'Daily', 'Weekly', 'Monthly']"
            label="Aggregate Data"
          />
        </v-col>
        <v-col sm="6" md="2">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="selectedDate"
                label="Select a Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="selectedDate"
              @input="menu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-spacer></v-spacer>
        <v-btn class="align-self-center" color="primary" @click="regenerateData"
          >Regenerate Data</v-btn
        >
      </v-row>
    </v-card>
    <v-card class="ma-2 my-5 px-5">
      <v-row>
        <v-col sm="4" md="2">
          <v-select
            v-model="selectedChartType"
            :items="['Line', 'Bar']"
            label="Chart Type"
          />
        </v-col>
        <v-col sm="4" md="3">
          <v-select
            v-model="selectedProperty"
            :items="['temperature', 'humidity', 'kWh']"
            label="Property"
          />
        </v-col>
      </v-row>
      <line-chart :data="allSensorChartData" :options="options" />
    </v-card>
    <v-card class="ma-2 my-5 px-5">
      <v-row>
        <v-col
          v-for="(data, index) in mixedChartData"
          :key="index"
          class="d-flex align-content-start flex-wrap justify-center"
          cols="12"
          sm="6"
        >
          <v-card-title>{{ data?.datasets?.[0].name }}</v-card-title>
          <sensor-mixed-chart :data="data" :options="mixedChartOptions" />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { loadSensorData } from "../utility/dataLoader";
import { aggregateSensorData } from "../utility/aggregateSensorData";
import { formatLabel } from "../utility/util";
import { getWeeksInLastFourMonths, dateFns } from "../utility/dateFns";
const { startOfWeek, endOfWeek } = dateFns;

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  Colors,
} from "chart.js";
import { Bar, Line } from "vue-chartjs";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  Colors
);

const LineChart = Line;

const SensorMixedChart = {
  extends: Bar,
  props: ["chartData", "options"],
  mounted() {
    if (this.chartData) {
      this.renderChart(this.chartData, this.options);
    }
  },
  watch: {
    chartData: {
      handler(newData) {
        if (newData) {
          this.renderChart(newData, this.options);
        }
      },
      deep: true,
    },
  },
};

export default {
  name: "Dashboard",
  components: {
    Bar,
    LineChart,
    SensorMixedChart,
  },
  data() {
    return {
      selectedAggregation: "Daily",
      selectedDate: new Date().toISOString().substr(0, 10),
      menu: false,
      selectedProperty: "temperature",
      selectedChartType: "Line",
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 16 / 9,
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {},
        },
      },
      mixedChartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 16 / 9,
        scales: {
          yTemperature: {
            type: "linear",
            display: true,
            position: "left",
            id: "yTemperature",
            // Additional configuration for this axis
          },
          yHumidity: {
            type: "linear",
            display: true,
            position: "left",
            id: "yHumidity",
            // Ensure this axis doesn't clash with the temperature axis
            grid: {
              drawOnChartArea: false,
            },
            // Additional configuration for this axis
          },
          yKwh: {
            type: "linear",
            display: true,
            position: "right",
            id: "yKwh",
            // Adjust this axis to not clash with others
            grid: {
              drawOnChartArea: false,
            },
            // Additional configuration for this axis
          },
        },
      },
    };
  },
  computed: {
    ...mapState(["sensorData"]),

    filteredSensorData() {
      return this.sensorData.map((sensor) => {
        return sensor.filter((data) => {
          const date = new Date(data.datetime);
          switch (this.selectedAggregation.toLowerCase()) {
            case "hourly":
              return date.toISOString().substr(0, 10) === this.selectedDate;
            case "daily": {
              const selectedDateObj = new Date(this.selectedDate);
              const selectedYear = selectedDateObj.getFullYear();
              const selectedMonth = selectedDateObj.getMonth();

              const year = date.getFullYear();
              const month = date.getMonth();

              return year === selectedYear && month === selectedMonth;
            }
            case "weekly": {
              const selectedDate = new Date(this.selectedDate);
              const weeks = getWeeksInLastFourMonths(selectedDate);

              return weeks.some((week) => {
                const weekStart = startOfWeek(week);
                const weekEnd = endOfWeek(week);
                const dateToCheck = new Date(date); // Convert string to date if necessary
                return dateToCheck >= weekStart && dateToCheck <= weekEnd;
              });
            }
            case "monthly":
              const selectedYear = new Date(this.selectedDate).getFullYear();
              const startYear = selectedYear - 1; //last two years
              return (
                date.getFullYear() >= startYear &&
                date.getFullYear() <= selectedYear
              );
          }
        });
      });
    },
    mixedChartData() {
      return this.filteredSensorData?.map((sensor) =>
        this.prepareChartData(
          aggregateSensorData(sensor, this.selectedAggregation?.toLowerCase())
        )
      );
    },
    allSensorChartData() {
      const data = {
        labels:
          this.mixedChartData.length > 0 ? this.mixedChartData[0].labels : [],
        datasets: this.mixedChartData.reduce((acc, { datasets }, index) => {
          const selectedDatasets = datasets.filter(
            ({ key }) => key === this.selectedProperty
          );

          selectedDatasets.forEach((dataset) => {
            acc.push({
              ...dataset,
              label: `Sensor_${index + 1}`,
              type: this.selectedChartType?.toLowerCase(),
            });
          });

          return acc;
        }, []),
      };

      return data;
    },
  },
  methods: {
    prepareChartData(sensorData) {
      const formattedLabels = sensorData.map((item) =>
        formatLabel(item.datetime, this.selectedAggregation?.toLowerCase())
      );
      const datasets = [];

      const dataKeys = Object.keys(sensorData[0]).filter(
        (key) => key !== "datetime"
      );
      dataKeys.forEach((key) => {
        const data = sensorData?.map((item) => item[key].value);
        let yAxisID = "";
        switch (key) {
          case "temperature":
            yAxisID = "yTemperature";
            break;
          case "humidity":
            yAxisID = "yHumidity";
            break;
          case "kWh":
            yAxisID = "yKwh";
            break;
        }
        datasets.push({
          ...sensorData[0][key],
          ...sensorData[0][key].chartStyle,
          data,
          key,
          yAxisID,
        });
      });

      return { labels: formattedLabels, datasets };
    },
    regenerateData() {
      loadSensorData(this.$store);
    },
  },
};
</script>
