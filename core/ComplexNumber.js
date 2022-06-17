export default class ComplexNumber {
	constructor(real, imaginary) {
		this.real = real;
		this.imaginary = imaginary;
	}

	add(other) {
		this.real += other.real;
		this.imaginary += other.imaginary;

		return this;
	}

	subtract(other) {
		this.real -= other.real;
		this.imaginary -= other.imaginary;

		return this;
	}

	multiply(other) {
		const real = this.real * other.real - this.imaginary * other.imaginary;
		const imaginary =
			this.imaginary * other.real + this.real * other.imaginary;

		this.real = real;
		this.imaginary = imaginary;

		return this;
	}

	divide(other) {
		const denominator = other.real ** 2 + other.imaginary ** 2;
		const real =
			(this.real * other.real + this.imaginary * other.imaginary) /
			denominator;

		const imaginary =
			(this.imaginary * other.real - this.real * other.imaginary) /
			denominator;
		this.real = real;
		this.imaginary = imaginary;

		return this;
	}

	toString() {
		if (this.imaginary === 0) return this.real;
		if (this.real === 0) return this.imaginary + 'i';
		if (this.imaginary < 0)
			return this.real + ' - ' + -this.imaginary + 'i';
		return this.real + ' + ' + this.imaginary + 'i';
	}

	magnitude() {
		return Math.sqrt(this.real ** 2 + this.imaginary ** 2);
	}

	magnitudeSquared() {
		return this.real ** 2 + this.imaginary ** 2;
	}

	clone() {
		return new ComplexNumber(this.real, this.imaginary);
	}
}
