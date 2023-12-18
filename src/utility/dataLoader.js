import { generateDataForMultipleSensors } from "./util";
import { saveToDB, readFromDB } from "./indexedDBUtils";
import { defaultSettings } from "../constants";

export async function loadSensorData(store) {
  const savedSettings = localStorage.getItem("appSettings");
  const appSettings = savedSettings
    ? JSON.parse(savedSettings)
    : defaultSettings;

  const dbName = "sensorAppDB";
  const storeName = "sensorData";
  try {
    let data = await readFromDB(dbName, storeName);
    // if (!data || data.length === 0) {
    const startDate = new Date(appSettings.startDate);
    const propertyRanges = appSettings.propertyRanges;

    data = generateDataForMultipleSensors(
      appSettings.numberOfSensors,
      startDate,
      propertyRanges
    );
    await saveToDB(dbName, storeName, data);
    // }
    data.length > 1
      ? store.dispatch("loadSensorData", data)
      : store.dispatch("loadSensorData", data[data.length - 1]);
  } catch (error) {
    console.error("Error accessing IndexedDB:", error);
  }
}
