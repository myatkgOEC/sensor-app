<template>
  <div>
    <v-row>
      <v-select
        v-model="selectedAggregation"
        :items="['hourly', 'daily', 'weekly', 'monthly']"
        label="Aggregate Data"
        class="mb-4"
      />
    </v-row>
    <v-row class="d-flex justify-center mb-6">
      <v-col
        class="d-flex align-content-start flex-wrap justify-center"
        cols="12"
      >
        <v-card v-for="(data, index) in chartData" :key="index" class="ma-2">
          <sensor-mixed-chart :data="data" :options="options" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { aggregateSensorData } from "../utility/aggregateSensorData";

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
} from "chart.js";
import { Bar } from "vue-chartjs";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  name: "ChartCard",
  components: {
    SensorMixedChart,
  },
  data() {
    return {
      selectedAggregation: "hourly",
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  computed: {
    ...mapState(["sensorData"]),
    chartData() {
      const computed = this.sensorData.map((sensor) =>
        this.prepareChartData(
          aggregateSensorData(sensor, this.selectedAggregation)
        )
      );
      return computed;
    },
  },
  methods: {
    prepareChartData(sensorData) {
      const labels = sensorData.map((item) => item.datetime);
      const datasets = [];

      const dataKeys = Object.keys(sensorData[0]).filter(
        (key) => key !== "datetime"
      );
      dataKeys.forEach((key) => {
        const data = sensorData.map((item) => item[key].value);
        datasets.push({
          label: sensorData[0][key].label,
          data: data,
          ...sensorData[0][key].chartStyle,
        });
      });

      return { labels, datasets };
    },
  },
};
</script>
