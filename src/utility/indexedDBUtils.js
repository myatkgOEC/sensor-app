/**
 * Opens a connection to the IndexedDB.
 * @param {string} dbName - The name of the database.
 * @param {number} version - The version of the database.
 * @returns {Promise<IDBDatabase>} - A promise that resolves to the database object.
 */
function openDB(dbName, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onerror = (event) => {
      reject("Database error: " + event.target.errorCode);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("sensorData", { autoIncrement: true });
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

/**
 * Saves data to IndexedDB.
 * @param {string} dbName - The name of the database.
 * @param {string} storeName - The name of the object store.
 * @param {Object} data - The data to save.
 * @returns {Promise<void>}
 */
export function saveToDB(dbName, storeName, data) {
  return openDB(dbName, 1).then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject("Failed to save data to the database");
    });
  });
}

/**
 * Reads data from IndexedDB.
 * @param {string} dbName - The name of the database.
 * @param {string} storeName - The name of the object store.
 * @returns {Promise<any>} - The data from the database.
 */
export function readFromDB(dbName, storeName) {
  return openDB(dbName, 1).then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Failed to read data from the database");
    });
  });
}
