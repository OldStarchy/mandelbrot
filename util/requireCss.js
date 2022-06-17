const requiredCss = {};
/**
 * eg. `requireCss('./main.css', import.meta.url);`
 */
export default function requireCss(path, base) {
	const absPath = new URL(path, base).pathname;

	if (requiredCss[absPath]) {
		return;
	}

	requiredCss[absPath] = true;

	const style = document.createElement('link');
	style.rel = 'stylesheet';
	style.href = absPath;

	document.head.appendChild(style);

	return new Promise(
		/** @param {(arg: void) => void} s */
		(s) => (style.onload = () => s())
	);
}
