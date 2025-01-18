<script lang="ts">
	// Icons
	import { Menu, FolderOpen, Save, File, FileBox } from "lucide-svelte";

	// UI
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={cn(
			buttonVariants({ variant: "outline", size: "icon" }),
			"absolute left-4 top-4 shadow-md"
		)}><Menu /></DropdownMenu.Trigger>
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
			<DropdownMenu.Item>
				<FileBox />
				<span>Import IGES</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<FileBox />
				<span>Import STEP</span>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
