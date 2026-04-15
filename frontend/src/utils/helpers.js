export const getNewId = (items, prefix = "ID") => {
	const max = items.reduce((acc, item) => {
		const n = parseInt((item.id || "").replace(`${prefix}-`, ""), 10);
		return isNaN(n) ? acc : Math.max(acc, n);
	}, 0);
	return `${prefix}-${String(max + 1).padStart(3, "0")}`;
};
