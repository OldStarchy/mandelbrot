import Vector3 from './Vector3.js';

export default class Matrix3 {
	constructor(a, b, c, d, e, f, g, h, i) {
		this.elements = [a, b, c, d, e, f, g, h, i];
	}

	toJson() {
		return this.elements;
	}

	static fromJson(json) {
		return new Matrix3(
			json[0],
			json[1],
			json[2],
			json[3],
			json[4],
			json[5],
			json[6],
			json[7],
			json[8]
		);
	}

	static translation(x, y) {
		return new Matrix3(1, 0, x, 0, 1, y, 0, 0, 1);
	}

	static scale(x, y) {
		return new Matrix3(x, 0, 0, 0, y, 0, 0, 0, 1);
	}

	static rotation(angle) {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		return new Matrix3(cos, -sin, 0, sin, cos, 0, 0, 0, 1);
	}

	static boundingBox(x1, y1, x2, y2) {
		return new Matrix3(x2 - x1, 0, x1, 0, y2 - y1, y1, 0, 0, 1);
	}

	multiply(other) {
		return new Matrix3(
			this.elements[0] * other.elements[0] +
				this.elements[1] * other.elements[3] +
				this.elements[2] * other.elements[6],
			this.elements[0] * other.elements[1] +
				this.elements[1] * other.elements[4] +
				this.elements[2] * other.elements[7],
			this.elements[0] * other.elements[2] +
				this.elements[1] * other.elements[5] +
				this.elements[2] * other.elements[8],
			this.elements[3] * other.elements[0] +
				this.elements[4] * other.elements[3] +
				this.elements[5] * other.elements[6],
			this.elements[3] * other.elements[1] +
				this.elements[4] * other.elements[4] +
				this.elements[5] * other.elements[7],
			this.elements[3] * other.elements[2] +
				this.elements[4] * other.elements[5] +
				this.elements[5] * other.elements[8],
			this.elements[6] * other.elements[0] +
				this.elements[7] * other.elements[3] +
				this.elements[8] * other.elements[6],
			this.elements[6] * other.elements[1] +
				this.elements[7] * other.elements[4] +
				this.elements[8] * other.elements[7],
			this.elements[6] * other.elements[2] +
				this.elements[7] * other.elements[5] +
				this.elements[8] * other.elements[8]
		);
	}

	transform(vector) {
		return new Vector3(
			this.elements[0] * vector.x +
				this.elements[1] * vector.y +
				this.elements[2] * vector.z,
			this.elements[3] * vector.x +
				this.elements[4] * vector.y +
				this.elements[5] * vector.z,
			this.elements[6] * vector.x +
				this.elements[7] * vector.y +
				this.elements[8] * vector.z
		);
	}

	inverse() {
		const a = this.elements[0];
		const b = this.elements[1];
		const c = this.elements[2];
		const d = this.elements[3];
		const e = this.elements[4];
		const f = this.elements[5];
		const g = this.elements[6];
		const h = this.elements[7];
		const i = this.elements[8];
		const det =
			a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
		if (det === 0) {
			return null;
		}
		return new Matrix3(
			(e * i - f * h) / det,
			(c * h - b * i) / det,
			(b * f - c * e) / det,
			(f * g - d * i) / det,
			(a * i - c * g) / det,
			(c * d - a * f) / det,
			(d * h - e * g) / det,
			(b * g - a * h) / det,
			(a * e - b * d) / det
		);
	}
}
