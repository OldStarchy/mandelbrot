import ComplexNumber from './core/ComplexNumber.js';

/**
 * @param {ComplexNumber} number
 */
export function distanceFunction(number) {
	const method = /** @type {string} */ ('circle');

	switch (method) {
		default:
		case 'circle':
			return number.magnitudeSquared() < 0.01;
		case 'square':
			return Math.abs(number.real) > 2 || Math.abs(number.imaginary) > 2;
	}
}
