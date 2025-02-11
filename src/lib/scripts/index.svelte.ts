import { browser, version } from "$app/environment";
import { myCanvas } from "$lib/runes/canvas.svelte";
import { ui } from "$lib/runes/ui.svelte";

// Types

export let dbData = undefined as
	| undefined
	| {
			name: string;
			version: string;
			canvasSaveRestore: {
				offsetX: number;
				offsetY: number;
				scale: number;
			};
			uiOptionsSaveRestore: typeof ui.options;
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

						// Restore canvas position and scale
						const canvasSaveRestore = indexedDBContent.canvasSaveRestore;
						myCanvas.offsetX = canvasSaveRestore.offsetX;
						myCanvas.offsetY = canvasSaveRestore.offsetX;
						myCanvas.scale = canvasSaveRestore.scale;

						// Restore ui options
						ui.options = indexedDBContent.uiOptionsSaveRestore;
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
				canvasSaveRestore: {
					offsetX: myCanvas.offsetX,
					offsetY: myCanvas.offsetY,
					scale: myCanvas.scale,
				},
				uiOptionsSaveRestore: ui.options,
			};

			indexedDBStore.put(dbData);
			indexedDB.close();
		},
	};
})();

if (browser) {
	window.addEventListener("beforeunload", myIndexedDB.saveState);
}
