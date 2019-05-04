const dbName = 'vecpad';
const dbVersion = 1;
const objectStoreName = 'objects';

// A wrapper class around IndexedDB
export default class IDBWrapper {
	constructor() {
		this.db = null;

		if (!window.indexedDB) {
			// eslint-disable-next-line no-console
			console.error('Your browser doesn\'t support IndexedDB, the scene cannot be saved.');
			return;
		}

		/*
			We use a promise since the connection to the DB is aynchronous and the
			object manage the connection internally. Hence, we need it at the creation.
		*/
		let loadDB = new Promise((resolve) => {
			let request = window.indexedDB.open(dbName, dbVersion);
			request.onupgradeneeded = this.createIDB;
			request.onsuccess = (event) => {
				resolve(event.target.result);
			};
		});

		loadDB.then((value) => {
			this.db = value;
		});
	}

	// Create the table
	createIDB = (event) => {
		let db = event.target.result;

		db.createObjectStore(objectStoreName, { keyPath: 'uuid' });
	}

	getAllObjects = (callback) => {
		let transaction = this.db.transaction([objectStoreName]);
		let objectStore = transaction.objectStore(objectStoreName);

		objectStore.getAll().onsuccess = (event) => {
			let selectedObject = localStorage.getItem("selectedObject");
			callback(event.target.result, selectedObject === "null" ? null : selectedObject);
		};
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
		};
	}

	// Remove all the objects
	clear = () => {
		let transaction = this.db.transaction([objectStoreName], 'readwrite');
		let objectStore = transaction.objectStore(objectStoreName);

		objectStore.clear();
	}
}