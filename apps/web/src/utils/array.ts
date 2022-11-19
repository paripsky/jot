export const range = (from: number, to: number) =>
	Array.from(new Array(to - from), (_x, i) => i + from);
