<template>
  <v-container>
    <v-form @submit.prevent="saveSettings">
      <v-text-field
        v-model="settings.startDate"
        label="Start Date"
        type="date"
      ></v-text-field>
      <v-text-field
        v-model="settings.numberOfSensors"
        label="Number Of Sensors"
        type="number"
      ></v-text-field>

      <v-expansion-panels v-model="panel">
        <v-expansion-panel
          v-for="(value, key) in settings.propertyRanges"
          :key="key"
        >
          <v-expansion-panel-header>{{ key }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-text-field
              v-model="value.range[0]"
              :label="`${key} Min Value`"
              type="number"
            ></v-text-field>
            <v-text-field
              v-model="value.range[1]"
              :label="`${key} Max Value`"
              type="number"
            ></v-text-field>
            <v-switch
              v-model="value.options.isFloat"
              label="Is Float"
            ></v-switch>
            <v-text-field v-model="value.label" label="Label"></v-text-field>
            <v-text-field
              v-model="value.options.aggregator"
              label="Aggregator"
            ></v-text-field>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-btn type="submit">Save Settings</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { defaultSettings } from "../constants";
export default {
  data() {
    return {
      settings: {
        startDate: defaultSettings.startDate,
        numberOfSensors: defaultSettings.numberOfSensors,
        propertyRanges: defaultSettings.propertyRanges,
      },
      panel: null, // For expansion panels
    };
  },
  methods: {
    saveSettings() {
      localStorage.setItem("appSettings", JSON.stringify(this.settings));
    },
  },
  created() {
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
    }
  },
};
</script>
