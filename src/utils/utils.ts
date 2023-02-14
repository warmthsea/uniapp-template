/** 提取文件后缀名 */
export const funGetSuffix = (str: string | null): string => {
	if (!str) return '';
	if (str.indexOf('.') == -1) return '';
	const fileExtension = str.substring(str.lastIndexOf('.') + 1);
	return fileExtension;
};

/** 等待 */
export const funAwaitTime = (timer: number): Promise<void> => {
	return new Promise((resolve, reject) => {
		let timers = setTimeout(() => {
			clearTimeout(timers);
			resolve();
		}, timer)
	});
};