export const ui = $state({
	options: {
		showGrid: true,
		magnet: true,
		editMode: "move" as "move" | "resize",
		showResults: false,
	},
	mouse: {
		x: 0,
		y: 0,
		down: false,
	},
});
