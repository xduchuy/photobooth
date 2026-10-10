/**
 * storage.js - Robust storage for Photobooth photos
 * Uses IndexedDB as primary high-capacity storage, with fallback to localStorage.
 * Prevents photo loss due to localStorage quota limits and handles migration from older versions.
 */
(function (window) {
  const DB_NAME = "photobooth_db";
  const DB_VERSION = 1;
  const STORE_NAME = "photos";

  function openPhotoDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        return reject(new Error("IndexedDB not supported"));
      }
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  const PhotoStorage = {
    async savePhoto(dataUrl) {
      if (!dataUrl) return false;
      let savedInDB = false;
      try {
        const db = await openPhotoDB();
        await new Promise((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, "readwrite");
          const store = tx.objectStore(STORE_NAME);
          const req = store.add({ dataUrl, createdAt: Date.now() });
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });
        savedInDB = true;
      } catch (e) {
        console.warn("IndexedDB save failed, fallback to localStorage only:", e);
      }

      // Sync to localStorage with quota protection for backward compatibility
      try {
        localStorage.setItem("latestPhoto", dataUrl);
        const raw = localStorage.getItem("latestPhotos");
        let list = raw ? JSON.parse(raw) : [];
        list = [dataUrl, ...list.filter((x) => x !== dataUrl)].slice(0, 10);
        try {
          localStorage.setItem("latestPhotos", JSON.stringify(list));
        } catch (quotaErr) {
          // If quota exceeded, trim list progressively
          try {
            localStorage.setItem("latestPhotos", JSON.stringify(list.slice(0, 3)));
          } catch (q2) {
            try {
              localStorage.setItem("latestPhotos", JSON.stringify([dataUrl]));
            } catch (q3) {
              // Only fail if neither IndexedDB nor localStorage could save
              if (!savedInDB) throw q3;
            }
          }
        }
        return true;
      } catch (err) {
        if (savedInDB) return true;
        console.error("Storage save failed in both IndexedDB and localStorage:", err);
        return false;
      }
    },

    async getLatestPhoto() {
      try {
        const db = await openPhotoDB();
        const photos = await new Promise((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, "readonly");
          const store = tx.objectStore(STORE_NAME);
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
        if (photos && photos.length > 0) {
          photos.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          return photos[0].dataUrl;
        }
      } catch (e) {
        console.warn("IndexedDB read failed, fallback to localStorage:", e);
      }
      return localStorage.getItem("latestPhoto") || "";
    },

    async getRecentPhotos(limit = 10) {
      try {
        const db = await openPhotoDB();
        const photos = await new Promise((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, "readonly");
          const store = tx.objectStore(STORE_NAME);
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
        if (photos && photos.length > 0) {
          photos.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          return photos.slice(0, limit).map((p) => p.dataUrl);
        }
      } catch (e) {
        console.warn("IndexedDB read failed, fallback to localStorage:", e);
      }
      try {
        const raw = localStorage.getItem("latestPhotos");
        const list = raw ? JSON.parse(raw) : [];
        return Array.isArray(list) ? list.slice(0, limit) : [];
      } catch (e) {
        return [];
      }
    }
  };

  window.PhotoStorage = PhotoStorage;
})(window);
