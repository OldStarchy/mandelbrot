/**
 * @template {any[]} TFnArgs
 * @param {(...args: TFnArgs) => void} fn
 * @param {number} timeout
 * @return {(...args: TFnArgs) => void}
 */
export default function debounce(fn, timeout) {
	let timer;
	/**
	 * @param {TFnArgs} args
	 */
	return function debounced(...args) {
		const that = this;
		clearTimeout(timer);
		timer = setTimeout(() => fn.apply(that, args), timeout);
	};
}
