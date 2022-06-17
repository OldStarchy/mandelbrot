import clamp from '../util/clamp.js';

/**
 * @template T
 */
export default class StateHistory {
	/**
	 * @param {T} initialState
	 */
	constructor(initialState) {
		/**
		 * @type {T[]}
		 */
		this.history = [initialState];
		this.head = 0;

		this.onChange = null;
		this.onMove = null;
	}

	/**
	 * @param {T} state
	 */
	push(state) {
		this.history.splice(++this.head, Infinity, state);
		this.onChange?.();
		this.onMove?.();
	}

	/**
	 * @param {number} relative
	 * @return {T}
	 */
	go(relative) {
		if ((relative | 0) !== relative)
			throw new Error('where must be an integer');

		return this.goTo(
			clamp(this.head + relative, 0, this.history.length - 1)
		);
	}

	/**
	 * @param {number} where
	 * @return {T}
	 */
	goTo(where) {
		if ((where | 0) !== where) throw new Error('where must be an integer');
		if (where < 0 || where >= this.history.length)
			throw new Error('where must be in the range [0, history.length)');

		if (this.head !== where) {
			this.head = where;
			this.onMove?.();
		}

		return this.history[this.head];
	}

	current() {
		return this.history[this.head];
	}
}
