import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sensorData: [],
  },
  getters: {},
  mutations: {
    setSensorData(state, data) {
      state.sensorData.length = 0;
      data.forEach((sensor) => {
        state.sensorData.push(sensor);
      });
    },
  },
  actions: {
    loadSensorData({ commit }, data) {
      commit("setSensorData", data);
    },
  },
  modules: {},
});
