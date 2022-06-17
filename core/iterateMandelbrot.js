import ComplexNumber from '../core/ComplexNumber.js';

function iterateMandelbrotJs(c, maxIterations) {
	let z = new ComplexNumber(0, 0);
	for (let i = 0; i < maxIterations; i++) {
		z = z.multiply(z).add(c);
		if (z.magnitudeSquared() > 4) return { iterations: i, z };
	}
	return { iterations: maxIterations, z };
}

export default iterateMandelbrotJs;
