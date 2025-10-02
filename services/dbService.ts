import type { HistoryItem } from '../types';
import { MAX_HISTORY_SIZE } from '../constants';

const DB_NAME = 'AI-Scene-Creator-DB';
const DB_VERSION = 2;
const STORE_NAME = 'history';
const FAVORITES_STORE_NAME = 'favorites';

let db: IDBDatabase;

function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject('Error opening database');
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      if (!dbInstance.objectStoreNames.contains(FAVORITES_STORE_NAME)) {
        dbInstance.createObjectStore(FAVORITES_STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function addHistoryItems(items: HistoryItem[]): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  for (const item of items) {
    store.put(item);
  }

  // Trim excess items in the same transaction
  const countRequest = store.count();

  return new Promise((resolve, reject) => {
    countRequest.onsuccess = () => {
      const count = countRequest.result;
      if (count > MAX_HISTORY_SIZE) {
        let itemsToDelete = count - MAX_HISTORY_SIZE;
        const index = store.index('createdAt');
        const cursorRequest = index.openCursor(); // Oldest first due to ascending order
        
        cursorRequest.onsuccess = (e) => {
          const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor && itemsToDelete > 0) {
            cursor.delete();
            itemsToDelete--;
            cursor.continue();
          }
        };
      }
    };

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      console.error("Transaction error in addHistoryItems:", transaction.error);
      reject(transaction.error);
    };
  });
}

export async function getAllHistoryItems(): Promise<HistoryItem[]> {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const index = store.index('createdAt');
  const request = index.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      // Sort descending (newest first)
      const sorted = request.result.sort((a, b) => b.createdAt - a.createdAt);
      resolve(sorted);
    };
    request.onerror = () => {
      console.error('Error fetching history:', request.error);
      reject('Could not fetch history');
    };
  });
}

export async function deleteHistoryItem(id: string): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.delete(id);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => {
      console.error('Error deleting item:', transaction.error);
      reject('Could not delete item');
    };
  });
}

export async function replaceAllHistory(items: HistoryItem[]): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  store.clear(); // Clear the existing history

  for (const item of items) {
    store.put(item); // Add each imported item
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      console.error("Transaction error in replaceAllHistory:", transaction.error);
      reject(transaction.error);
    };
  });
}

// Favorite Functions
export async function addFavorite(item: HistoryItem): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(FAVORITES_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(FAVORITES_STORE_NAME);
  store.put(item);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => {
      console.error('Error adding favorite:', transaction.error);
      reject('Could not add favorite');
    };
  });
}

export async function removeFavorite(id: string): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction(FAVORITES_STORE_NAME, 'readwrite');
  const store = transaction.objectStore(FAVORITES_STORE_NAME);
  store.delete(id);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => {
      console.error('Error removing favorite:', transaction.error);
      reject('Could not remove favorite');
    };
  });
}

export async function getAllFavorites(): Promise<HistoryItem[]> {
  const db = await initDB();
  const transaction = db.transaction(FAVORITES_STORE_NAME, 'readonly');
  const store = transaction.objectStore(FAVORITES_STORE_NAME);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      // Sort descending (newest first)
      const sorted = request.result.sort((a, b) => b.createdAt - a.createdAt);
      resolve(sorted);
    };
    request.onerror = () => {
      console.error('Error fetching favorites:', request.error);
      reject('Could not fetch favorites');
    };
  });
}

export async function getFavoriteIds(): Promise<Set<string>> {
    const db = await initDB();
    const transaction = db.transaction(FAVORITES_STORE_NAME, 'readonly');
    const store = transaction.objectStore(FAVORITES_STORE_NAME);
    const request = store.getAllKeys();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(new Set(request.result as string[]));
        };
        request.onerror = () => {
            console.error('Error fetching favorite keys:', request.error);
            reject('Could not fetch favorite keys');
        };
    });
}