<template>
  <v-app id="app">
    <navigation-drawer
      :drawer="drawer"
      :group="group"
      @update:drawer="drawer = $event"
    />
    <app-bar @toggle-drawer="drawer = !drawer" />
    <v-main>
      <v-container fluid>
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
import { loadSensorData } from "./utility/dataLoader";
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
    await loadSensorData(this.$store);
  },
};
</script>
