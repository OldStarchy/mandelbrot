import randId from '../util/randId.js';

/**
 * @template T
 * @typedef {{
 * 	created: number;
 * 	id: string;
 * 	state: T;
 * 	children: HistoryNode<T>[];
 * 	parent: null | HistoryNode<T>;
 * }} HistoryNode
 */

/**
 * @template T
 */
export default class HistoryTree {
	/**
	 * @param {T} initialState
	 */
	constructor(initialState) {
		/**
		 * @type {HistoryNode<T>}
		 */
		this.root = {
			created: Date.now(),
			id: 'root',
			state: initialState,
			children: [],
			parent: null,
		};

		this.current = this.root;

		this.onChange = new EventSource('change');
		this.onMove = new EventSource('move');
	}

	/**
	 * @param {T} state
	 */
	push(state) {
		const node = {
			created: Date.now(),
			id: randId(),
			state,
			children: [],
			parent: this.current,
		};

		this.current.children.push(node);
		this.current = node;

		this.onChange.dispatchEvent(new CustomEvent('change'));
		this.onMove.dispatchEvent(new CustomEvent('move'));
	}

	/**
	 * @return {T}
	 */
	currentState() {
		return this.current.state;
	}

	/**
	 * @param {HistoryNode<T>} node
	 * @return {number[]}
	 */
	#getPath(node) {
		const path = [];

		while (node.parent !== null) {
			path.push(node.parent.children.indexOf(node));
			node = node.parent;
		}

		return path.reverse();
	}

	/**
	 * @param {number[]} path
	 * @return {HistoryNode<T>}
	 */
	#getNode(path) {
		let node = this.root;

		for (const n of path) {
			node = node.children[n];
		}

		return node;
	}

	/**
	 * @param {number} relative
	 * @return {T}
	 */
	go(relative) {
		if ((relative | 0) !== relative)
			throw new Error('where must be an integer');

		let node = this.current;
		while (relative < 0 && node.parent !== null) {
			node = node.parent;
			relative++;
		}

		while (relative > 0 && node.children.length === 1) {
			node = node.children[0];
			relative--;
		}

		return this.goTo(node.id);
	}

	/**
	 * @param {HistoryNode<T>} from
	 * @param {string} nodeId
	 * @return {HistoryNode<T> | null}
	 */
	#findNodeWithId(from, nodeId) {
		if (from.id === nodeId) return from;

		for (const child of from.children) {
			const node = this.#findNodeWithId(child, nodeId);

			if (node !== null) return node;
		}

		return null;
	}

	/**
	 * @param {string} nodeId
	 * @return {T}
	 */
	goTo(nodeId) {
		if (this.current.id !== nodeId) {
			const node = this.#findNodeWithId(this.root, nodeId);
			if (node) {
				this.current = node;
				this.onMove.dispatchEvent(new CustomEvent('move'));
			}
		}

		return this.current.state;
	}
}
