<template>
  <v-navigation-drawer v-model="drawer" app absolute temporary>
    <v-list nav dense>
      <v-list-item-group
        v-model="group"
        active-class="deep-purple--text text--accent-4"
      >
        <v-list-item
          v-for="route in $router.options.routes"
          :key="route.path"
          @click="navigateTo(route.path)"
        >
          <v-list-item-title>{{ route.name }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "NavigationDrawer",
  methods: {
    navigateTo(path) {
      this.$router.push(path);
      this.$emit("update:drawer", false);
    },
  },
};
</script>
<script setup>
import { defineProps, ref } from "vue";

const props = defineProps({
  drawer: {
    type: Boolean,
    required: true,
  },
  group: {
    type: Number,
    default: null,
  },
});
</script>
