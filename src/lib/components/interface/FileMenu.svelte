<script lang="ts">
	// Icons
	import { Menu, FolderOpen, Save, File, FileBox } from "lucide-svelte";

	// UI
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";
	import { Polygon } from "../../canvas/shapes/Polygon/rune.svelte";

	const importIges = async () => {
			// @ts-expect-error occt-import-js library doesn't have typing
			const occtimportjs = await import("occt-import-js"),
				occt = await occtimportjs.default(),
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
				result = occt.ReadIgesFile(new Uint8Array(await igsFile.arrayBuffer()), null);

			for (const mesh of result.meshes) {
				Polygon.createFromImport(
					mesh.attributes.position.array,
					mesh.index.array,
					mesh.attributes.normal.array
				);
			}
		},
		importStep = async () => {
			// @ts-expect-error occt-import-js library doesn't have typing
			const occtimportjs = await import("occt-import-js"),
				occt = await occtimportjs.default(),
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
				result = occt.ReadStepFile(new Uint8Array(await igsFile.arrayBuffer()), null);

			for (const mesh of result.meshes) {
				Polygon.createFromImport(
					mesh.attributes.position.array,
					mesh.index.array,
					mesh.attributes.normal.array
				);
			}
		};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={cn(
			buttonVariants({ variant: "outline", size: "icon" }),
			"absolute left-4 top-4 shadow-md"
		)}>
		<Menu />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="start">
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
		<DropdownMenu.Group>
			<DropdownMenu.Item onclick={importIges}>
				<FileBox />
				<span>Import IGES</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={importStep}>
				<FileBox />
				<span>Import STEP</span>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
