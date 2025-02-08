export const ui = $state({
	options: {
		showGrid: true,
		magnet: true,
		editMode: "move" as "move" | "resize",
	},
	mouse: {
		x: 0,
		y: 0,
		down: false,
	},
});
