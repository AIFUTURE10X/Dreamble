
import type { HistoryItem } from '../types';
import { MAX_HISTORY_SIZE } from '../constants';

const DB_NAME = 'AI-Scene-Creator-DB';
const DB_VERSION = 1;
const STORE_NAME = 'history';

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
