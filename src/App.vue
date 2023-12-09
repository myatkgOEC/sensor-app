<template>
  <v-app id="app">
    <navigation-drawer
      :drawer="drawer"
      :group="group"
      @update:drawer="drawer = $event"
    />
    <app-bar @toggle-drawer="drawer = !drawer" />
    <v-main>
      <v-container>
        <v-fade-transition mode="out-in">
          <router-view />
        </v-fade-transition>
      </v-container>
    </v-main>
    <v-footer app></v-footer>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import NavigationDrawer from "./components/NavigationDrawer.vue";
import AppBar from "./components/AppBar.vue";

const drawer = ref(false);
</script>

<script>
import { generateDataForMultipleSensors } from "./utility/util";
import { saveToDB, readFromDB } from "./utility/indexedDBUtils";
export default {
  name: "App",
  computed: {
    group() {
      const currentPath = this.$route.path;
      const routes = this.$router.options.routes;
      const activeRouteIndex = routes.findIndex(
        (route) => route.path === currentPath
      );
      return activeRouteIndex >= 0 ? activeRouteIndex : null;
    },
  },
  async created() {
    await this.loadSensorData();
  },
  methods: {
    async loadSensorData() {
      const dbName = "sensorAppDB";
      const storeName = "sensorData";
      try {
        let data = await readFromDB(dbName, storeName)?.[0];

        if (!data || data.length === 0) {
          const startDate = new Date("2023-12-01T00:00:00");
          const propertyRanges = {
            temperature: {
              range: [20, 35],
              options: {
                isFloat: true,
                chartStyle: {
                  type: "line",
                  backgroundColor: "red",
                  borderColor: "red",
                  fill: false,
                },
                label: "Temperature (°C)",
                aggregator: "median",
              },
            },
            humidity: {
              range: [30, 70],
              options: {
                chartStyle: { type: "line", borderColor: "blue", fill: false },
                label: "Humidity (%)",
                aggregator: "median",
              },
            },
            kWh: {
              range: [1, 30],
              options: {
                chartStyle: { type: "bar", borderColor: "pink", fill: true },
                label: "kWh",
                aggregator: "sum",
              },
            },
          };

          data = generateDataForMultipleSensors(5, startDate, propertyRanges);
          await saveToDB(dbName, storeName, data);
        }

        this.$store.dispatch("loadSensorData", data);
      } catch (error) {
        console.error("Error accessing IndexedDB:", error);
      }
    },
  },
};
</script>
