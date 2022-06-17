import ComplexNumber from '../core/ComplexNumber.js';

/**
 * @param {ComplexNumber} c
 * @param {number} maxIterations
 * @returns {{iterations: number; z: ComplexNumber}}
 */
function iterateMandelbrotJs(c, maxIterations) {
	let z = new ComplexNumber(0, 0);
	for (let i = 0; i < maxIterations; i++) {
		z = z.multiply(z).add(c);

		if (z.magnitudeSquared() > 4) return { iterations: i, z };
	}
	return { iterations: maxIterations, z };
}

/**
 * @param {ComplexNumber} initial
 * @param {ComplexNumber} c
 * @param {number} maxIterations
 * @returns {{iterations: number; z: ComplexNumber}}
 */
function iterateJuliaJs(initial, c, maxIterations) {
	let z = initial;
	for (let i = 0; i < maxIterations; i++) {
		if (z.magnitudeSquared() > 4) return { iterations: i, z };
		z = z.multiply(z).add(c);
	}
	return { iterations: maxIterations, z };
}

export default iterateMandelbrotJs;
export { iterateJuliaJs };
