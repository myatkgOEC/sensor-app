<template>
  <v-app-bar color="deep-purple accent-4" app dark dense>
    <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-filter</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { defineEmits } from "vue";

const emit = defineEmits(["toggle-drawer"]);

const toggleDrawer = () => {
  emit("toggle-drawer");
};
</script>
