<script lang="ts">
	// Import icon components from lucide
	import { Menu, FolderOpen, Save, File, FileBox } from "@lucide/svelte";

	// Import UI primitives and utilities
	import * as Card from "$lib/components/ui/card/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";

	// Import Polygon shape and canvas reference
	import { Polygon } from "../../../canvas/shapes/Polygon/rune.svelte";
	import { myCanvas } from "$lib/runes/canvas.svelte";

	// Function to import IGES files and add meshes to the canvas
	const importIges = async () => {
			// Dynamically import occt-import-js (no typings available)
			// @ts-expect-error occt-import-js library doesn't have typing
			const occtimportjs = await import("occt-import-js"),
				occt = await occtimportjs.default(),
				// Open file picker for IGES files
				[openFileHandle] = await window.showOpenFilePicker({
					types: [
						{
							description: "IGES file",
							accept: {
								"application/iges": [".igs"],
							},
						},
					],
					excludeAcceptAllOption: true,
					multiple: false,
				}),
				igsFile = await openFileHandle.getFile(),
				// Parse IGES file into meshes
				result = occt.ReadIgesFile(new Uint8Array(await igsFile.arrayBuffer()), null);

			// Create Polygon objects from imported meshes
			for (const mesh of result.meshes) {
				Polygon.createFromImport(
					mesh.attributes.position.array,
					mesh.index.array,
					mesh.attributes.normal.array
				);
			}

			// Adjust canvas view to fit new objects
			myCanvas.fitView();
		},
		// Function to import STEP files and add meshes to the canvas
		importStep = async () => {
			// Dynamically import occt-import-js (no typings available)
			// @ts-expect-error occt-import-js library doesn't have typing
			const occtimportjs = await import("occt-import-js"),
				occt = await occtimportjs.default(),
				// Open file picker for STEP files
				[openFileHandle] = await window.showOpenFilePicker({
					types: [
						{
							description: "STEP file",
							accept: {
								"application/step": [".stp"],
							},
						},
					],
					excludeAcceptAllOption: true,
					multiple: false,
				}),
				igsFile = await openFileHandle.getFile(),
				// Parse STEP file into meshes
				result = occt.ReadStepFile(new Uint8Array(await igsFile.arrayBuffer()), null);

			// Create Polygon objects from imported meshes
			for (const mesh of result.meshes) {
				Polygon.createFromImport(
					mesh.attributes.position.array,
					mesh.index.array,
					mesh.attributes.normal.array
				);
			}
			// Adjust canvas view to fit new objects
			myCanvas.fitView();
		};
</script>

<!-- File menu card with dropdown actions -->
<Card.Root class="pointer-events-auto self-start rounded-md p-0">
	<DropdownMenu.Root>
		<!-- Menu trigger button -->
		<DropdownMenu.Trigger class={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
			<Menu />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="start">
			<!-- File actions group -->
			<DropdownMenu.Group>
				<DropdownMenu.Item>
					<File />
					<span>New</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<FolderOpen />
					<span>Open</span>
					<DropdownMenu.Shortcut>⌘O</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
				<DropdownMenu.Item>
					<Save />
					<span>Save</span>
					<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
				</DropdownMenu.Item>
			</DropdownMenu.Group>

			<DropdownMenu.Separator />
			<!-- Import actions group -->
			<DropdownMenu.Group>
				<!-- Import IGES file menu item -->
				<DropdownMenu.Item onclick={importIges}>
					<FileBox />
					<span>Import IGES</span>
				</DropdownMenu.Item>
				<!-- Import STEP file menu item -->
				<DropdownMenu.Item onclick={importStep}>
					<FileBox />
					<span>Import STEP</span>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Card.Root>
