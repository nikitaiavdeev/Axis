import { browser, version } from "$app/environment";
import { ui } from "$lib/runes/ui.svelte";

// Types

export let dbData = undefined as
	| undefined
	| {
			name: string;
			version: string;
			ui: typeof ui;
	  };

export const myIndexedDB = (() => {
	const databaseName = "db",
		storeName = "main-store",
		datasetName = "main";

	let indexedDBOpen: IDBOpenDBRequest;

	return {
		async init() {
			indexedDBOpen = indexedDB.open(databaseName, 1);

			await new Promise((resolve) => {
				// Create store if it doesn't exist
				indexedDBOpen.onupgradeneeded = () => {
					const indexedDB = indexedDBOpen.result;

					indexedDB.createObjectStore(storeName, { keyPath: "name" });
					resolve(null);
				};

				// Open store and load data
				indexedDBOpen.onsuccess = async () => {
					await this.loadState();
					resolve(null);
				};
			});
		},
		async loadState() {
			const indexedDB = indexedDBOpen.result,
				indexedStore = indexedDB.transaction(storeName, "readwrite").objectStore(storeName);

			await new Promise((resolve) => {
				indexedStore.get(datasetName).onsuccess = async (event: Event) => {
					const indexedDBStore = event.target as IDBRequest,
						indexedDBContent = indexedDBStore.result as typeof dbData;

					if (!indexedDBContent) {
						resolve(null);
						return;
					}

					if (!("version" in indexedDBContent)) {
						resolve(null);
						return;
					}

					if (indexedDBContent.version != version) {
						// Clear indexedDB if older version
						indexedStore.clear();
					} else {
						// Load data from indexedDB
						ui.options = indexedDBContent.ui.options;
					}

					resolve(null);
				};
			});
		},
		saveState() {
			if (indexedDBOpen.readyState != "done") return;

			const indexedDB = indexedDBOpen.result,
				indexedDBStore = indexedDB.transaction(storeName, "readwrite").objectStore(storeName);

			dbData = {
				name: datasetName,
				version: version,
				ui: $state.snapshot(ui),
			};

			indexedDBStore.put(dbData);
			indexedDB.close();
		},
	};
})();

if (browser) {
	window.addEventListener("beforeunload", myIndexedDB.saveState);
}
