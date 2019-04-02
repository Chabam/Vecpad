const dbName = 'vecpad';
const dbVersion = 1;
const objectStoreName = 'objects';

export default class IDBWrapper {

	constructor() {
		this.db = null;

		if (!window.indexedDB) {
			console.error('Your browser doesn\'t support IndexedDB, the scene cannot be saved.');
			return;
		}

		let loadDB = new Promise((resolve) => {
			let request = window.indexedDB.open(dbName, dbVersion);
			request.onerror = (event) => console.error(`Could not load the scene : ${event.target.errorCode}`);
			request.onupgradeneeded = this.createIDB;
			request.onsuccess = (event) => {
				 resolve(event.target.result);
			}
		});

		loadDB.then((value) => {
			this.db = value;
		});
	}

	createIDB = (event) => {
		let db = event.target.result;

		db.createObjectStore(objectStoreName, { keyPath: 'uuid' });
	}

	getAllObjects = (callback) => {
		let transaction = this.db.transaction([objectStoreName]);
		let objectStore = transaction.objectStore(objectStoreName);
		objectStore.getAll().onsuccess = (event) => {
			callback(event.target.result);
		}
	}

	addObjects = (json) => {
		let transaction = this.db.transaction([objectStoreName], 'readwrite');
		let objectStore = transaction.objectStore(objectStoreName);

		json.forEach((object) => {
			objectStore.add(object);
		});
	}

	removeObject = (uuid) => {
		let transaction = this.db.transaction([objectStoreName], 'readwrite');
		let objectStore = transaction.objectStore(objectStoreName);
		objectStore.delete(uuid);
	}

	updateObject = (uuid, valueName, value) => {
		let transaction = this.db.transaction([objectStoreName], 'readwrite');
		let objectStore = transaction.objectStore(objectStoreName);
		let request = objectStore.get(uuid);
		request.onsuccess = (event) => {
			let object = event.target.result;

			object[valueName] = value;

			objectStore.put(object);
		}
	}

	clear = () => {
		let transaction = this.db.transaction([objectStoreName], 'readwrite');
		let objectStore = transaction.objectStore(objectStoreName);
		objectStore.clear();
	}
}