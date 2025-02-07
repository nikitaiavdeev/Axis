export const roundFloat = (num: number, decimals = 6): number => {
	return Number(num.toFixed(decimals));
};
