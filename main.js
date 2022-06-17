//@ts-check

import 'https://unpkg.com/classnames';
import htm from 'https://unpkg.com/htm?module';
import {useEffect, useRef, useState} from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';
import {h, render} from 'https://unpkg.com/preact@latest?module';


const html = htm.bind(h);

class ComplexNumber {
	constructor(real, imaginary) {
		this.real = real;
		this.imaginary = imaginary;
	}

	add(other) {
		// return new ComplexNumber(
		// 	this.real + other.real,
		// 	this.imaginary + other.imaginary
		// );

		this.real += other.real;
		this.imaginary += other.imaginary;

		return this;
	}

	subtract(other) {
		// return new ComplexNumber(
		// 	this.real - other.real,
		// 	this.imaginary - other.imaginary
		// );

		this.real -= other.real;
		this.imaginary -= other.imaginary;

		return this;
	}

	multiply(other) {
		// return new ComplexNumber(
		// 	this.real * other.real -
		// 		this.imaginary * other.imaginary,
		// 	this.imaginary * other.real +
		// 		this.real * other.imaginary
		// );

		const real =
			this.real * other.real -
			this.imaginary * other.imaginary;
		const imaginary =
			this.imaginary * other.real +
			this.real * other.imaginary;

		this.real = real;
		this.imaginary = imaginary;

		return this;
	}

	divide(other) {
		const denominator = other.real ** 2 + other.imaginary ** 2;
		// return new ComplexNumber(
		// 	(this.real * other.real +
		// 		this.imaginary * other.imaginary) /
		// 		denominator,
		// 	(this.imaginary * other.real -
		// 		this.real * other.imaginary) /
		// 		denominator
		// );

		const real =
			(this.real * other.real +
				this.imaginary * other.imaginary) /
			denominator;

		const imaginary =
			(this.imaginary * other.real -
				this.real * other.imaginary) /
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

function iterateMandelbrot(c, maxIterations) {
	let z = new ComplexNumber(0, 0);
	for (let i = 0; i < maxIterations; i++) {
		z = z.multiply(z).add(c);
		// z = new ComplexNumber(z.imaginary, z.real);
		if (z.magnitudeSquared() > 4) return { iterations: i, z };
	}
	return { iterations: maxIterations, z };
}

function iterateMandelbrotAndGetPath(c, maxIterations) {
	const path = [];
	let z = new ComplexNumber(0, 0);
	maxIterations = Math.max(1, maxIterations);
	path.push(z.clone());
	for (let i = 0; i < maxIterations; i++) {
		z = z.multiply(z).add(c);
		path.push(z.clone());
		// z = new ComplexNumber(z.imaginary, z.real);
		if (z.magnitudeSquared() > 4) return path;
	}

	return path;
}

function rainbowColour(iterations) {
	const hue = iterations;
	const saturation = 25 + Math.abs((iterations % 100) - 50);
	const luminance = iterations % 2 === 0 ? 50 : 25;
	return `hsl(${hue}, ${saturation}%, ${luminance}%)`;
}

class Vector3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	toString() {
		return `${this.x}, ${this.y}`;
	}
}

/**
 * A 3x3 matrix class
 */
class Matrix3 {
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
			a * (e * i - f * h) -
			b * (d * i - f * g) +
			c * (d * h - e * g);
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


/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} width
 * @param {number} height
 * @param {Matrix3} transform
 * @param {number} maxIterations
 * @param {AbortSignal} abort
 */
async function drawMandelbrot(
	canvas,
	width,
	height,
	transform,
	maxIterations,
	abort
) {
	//Start timing execution
	const startTime = performance.now();

	const context = canvas.getContext('2d');
	// context.clearRect(0, 0, width, height);
	for (let y = 0; y < height; y++) {
		await new Promise((s) => setTimeout(s, 0));

		for (let x = 0; x < width; x++) {
			if (abort.aborted) {
				return;
			}
			const transformedPoint = transform.transform(
				new Vector3(x / width, y / height, 1)
			);

			const c = new ComplexNumber(
				transformedPoint.x,
				transformedPoint.y
			);
			const result = iterateMandelbrot(c, maxIterations);
			if (result.iterations === maxIterations)
				context.fillStyle = 'black';
			else
				context.fillStyle = rainbowColour(
					result.iterations
				);
			context.fillRect(x, y, 1, 1);
		}
	}

	//Stop timing execution
	const endTime = performance.now();
	console.log(
		`Execution time: ${
			endTime - startTime
		} ms. MaxIterations: ${maxIterations}`
	);
	document.title = `Execution time: ${
		endTime - startTime
	} ms. MaxIterations: ${maxIterations}`;
}

/**
 * @param {number} width
 * @param {number} height
 * @param {Matrix3} transform
 * @param {number} maxIterations
 */
function createThumbnail(width, height, transform, maxIterations) {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");

	drawMandelbrot(canvas, width, height, transform, maxIterations, new AbortController().signal);
	return canvas;
}

/**
 * @template {any[]} TFnArgs
 * @param {(...args: TFnArgs) => void} fn
 * @param {number} timeout
 * @return {(...args: TFnArgs) => void}
 */
function debounce(fn, timeout) {
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


window.addEventListener('load', () => {
	let maxIterations = 5000;
	const canvasEle = document.getElementById('canvas');
	if (!(canvasEle instanceof HTMLCanvasElement)) throw new Error("Invalid canvas element");
	const canvas = canvasEle;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	let pathLength = 0;

	/**
	 * @param {Matrix3} transform
	 * @return {HistoryItem}
	 */
	function createHistoryItem(transform) {
		return {
			transform,
			thumbnail: createThumbnail(150, 150, transform, maxIterations)
		}
	}
	const history = new HistoryTree(createHistoryItem(Matrix3.boundingBox(-2, -2, 2, 2)));

	render(h(HistoryTreeView, {historyTree: history}, null), document.getElementById('history'));

	// const historyGui = /** @type {HistoryElement|undefined} */ (document.getElementById('history'));

	let abortController = new AbortController();
	// history.onChange = () => {

	// 	if (historyGui) {
	// 		historyGui.clear();

	// 		historyGui.append(
	// 			...history.history.map((item, index) => {
	// 				const button = document.createElement('button');
	// 				button.appendChild(item.thumbnail);
	// 				button.style.padding = '0';
	// 				button.style.margin = '0';
	// 				button.style.border = 'none';
	// 				button.style.background = 'none';
	// 				button.style.cursor = 'pointer';
	// 				button.style.display = 'flex';
	// 				button.addEventListener('click', () => {
	// 					history.goTo(index)
	// 				});
	// 				return button;
	// 			})
	// 		);
	// 	}
	// };

	function drawCurrent() {
		abortController.abort();

		abortController = new AbortController();
		drawMandelbrot(
			canvas,
			canvas.width,
			canvas.height,
			history.currentState().transform,
			maxIterations,
			abortController.signal
		);
	}
	const drawDebounced = debounce(drawCurrent, 1000);
	history.onMove.addEventListener('move',  () => {

		drawCurrent();
	});





	window.addEventListener(
		'resize',
		debounce(() => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			drawCurrent();
		}, 100)
	);

	//adjust maxiterations with mouse wheel scroll
	canvas.addEventListener('wheel', (event) => {
		event.preventDefault();
		let delta = event.deltaY > 0 ? 1 : -1;
		if (event.shiftKey) delta *= 100;

		if (!event.ctrlKey) {
			pathLength = Math.max(1, pathLength + delta);
			document.title = `Path length: ${pathLength}`;
			return;
		}

		//adjust maxiterations by delta but minimum of 1
		maxIterations = Math.max(1, maxIterations + delta);

		//put a message in the title with maxIterations
		document.title = `${maxIterations}`;

		drawDebounced();
	});

	window.addEventListener('keydown', (e) => {
		// if ctrl + a number key is pressed, save the current transform to local storage
		if (e.ctrlKey && e.keyCode >= 49 && e.keyCode <= 57) {
			e.preventDefault();

			//if there's already a save here, confirm overwrite
			if (
				localStorage.getItem(`transform${e.keyCode - 48}`)
			) {
				if (
					!confirm(
						`Overwrite saved transform ${
							e.keyCode - 48
						}?`
					)
				)
					return;
			}

			localStorage.setItem(
				`transform${e.keyCode - 48}`,
				JSON.stringify(history.currentState().transform.toJson())
			);

			//alert the user
			alert(`Saved transform ${e.keyCode - 48}`);
		}

		//otherwise if a number key is pressed, load the transform from local storage
		else if (e.keyCode >= 49 && e.keyCode <= 57) {
			e.preventDefault();

			const savedTransform = localStorage.getItem(
				`transform${e.keyCode - 48}`
			);
			if (savedTransform) {
				history.push(createHistoryItem(Matrix3.fromJson(JSON.parse(savedTransform))));
				alert(`Loading transform ${e.keyCode - 48}`);

				drawCurrent();
			} else {
				alert(`No saved transform ${e.keyCode - 48}`);
			}
		}

		// otherwise if the tilde key is pressed and there's a transform in the stack, pop it
		else if (e.keyCode === 192) {
			e.preventDefault();

			// if shift is pressed, reload the transform from the forward history
			const oldHead = history.current;

			if (e.shiftKey) {
				history.go(1);
			} else {
				history.go(-1);
			}

			if (history.current !== oldHead)
			{
				drawCurrent();
			}
		}

		// otherwise if ctrl s is pressed, prompt for a resolution and trigger a download of a high res image of the mandelbrot set
		else if (e.ctrlKey && e.keyCode === 83) {
			e.preventDefault();

			// prompt for x and y resolution
			const res = prompt(
				'Enter x and y resolution (separated by a space)',
				'1920 1080'
			);
			const resolution = res
				.split(' ')
				.map((x) => parseInt(x));

			if (
				resolution.length !== 2 ||
				resolution.some(
					(dimension) =>
						typeof dimension !== 'number' ||
						dimension < 1
				)
			) {
				alert('Invalid resolution');
				return;
			}

			const [width, height] = resolution;

			const canvasHiRes = document.createElement('canvas');
			canvasHiRes.width = width;
			canvasHiRes.height = height;
			const context = canvasHiRes.getContext('2d');

			(async() => {
				await drawMandelbrot(
					canvasHiRes,
					canvasHiRes.width,
					canvasHiRes.height,
					history.currentState().transform,
					maxIterations,
					new AbortController().signal
				);

				const link = document.createElement('a');
				link.download = `mandelbrot.png`;
				link.href = canvasHiRes.toDataURL();
				link.click();
			})()
		}
	});
	drawCurrent();

	let clickStart = null;
	canvas.addEventListener('mousedown', (event) => {
		// If middle mouse button is pressed, zoom out
		if (event.button === 1) {
			history.push(createHistoryItem(Matrix3.boundingBox(-2, -2, 2, 2)));
			event.preventDefault();

			drawCurrent();
			return;
		}

		if (event.button !== 0) return;

		clickStart = new Vector3(event.offsetX, event.offsetY, 1);
	});

	canvas.addEventListener('mousemove', (event) => {
		const context = canvas.getContext('2d');
		context.strokeStyle = '#fff2';

		if (pathLength > 0) {
			const transformedPoint = history.currentState().transform.transform(
				new Vector3(
					event.offsetX / canvas.width,
					event.offsetY / canvas.height,
					1
				)
			);

			const c = new ComplexNumber(
				transformedPoint.x,
				transformedPoint.y
			);

			const path = iterateMandelbrotAndGetPath(c, pathLength);

			const inverseTransform = history.currentState().transform.inverse();

			context.beginPath();
			path.forEach((point, index) => {
				const pointInCanvas = inverseTransform.transform(
					new Vector3(point.real, point.imaginary, 1)
				);

				pointInCanvas.x /= pointInCanvas.z;
				pointInCanvas.y /= pointInCanvas.z;

				if (index === 0) {
					context.moveTo(
						pointInCanvas.x * canvas.width,
						pointInCanvas.y * canvas.height
					);
				} else {
					context.lineTo(
						pointInCanvas.x * canvas.width,
						pointInCanvas.y * canvas.height
					);
				}
			});
			context.stroke();
		}

		if (event.button !== 0) return;
		if (!clickStart) return;

		//draw rectangle from clickstart to current position
		context.beginPath();
		context.rect(
			clickStart.x,
			clickStart.y,
			event.offsetX - clickStart.x,
			event.offsetY - clickStart.y
		);
		context.stroke();
	});

	canvas.addEventListener('mouseup', (event) => {
		//ignore non-left clicks
		if (event.button !== 0) return;
		if (!clickStart) return;

		const clickEnd = new Vector3(
			event.offsetX,
			event.offsetY,
			1
		);



		history.push(
			createHistoryItem(history.currentState().transform.multiply(
				Matrix3.boundingBox(
					clickStart.x / canvas.width,
					clickStart.y / canvas.height,
					clickEnd.x / canvas.width,
					clickEnd.y / canvas.height
				)
			))
		);
		clickStart = null;

		drawCurrent();
	});

});

//custom html component for history
class HistoryElement extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.innerHTML = /*html*/`
<style>
</style>

<div class="history">
<button class="history__show-hide">+</button>
<div class="history__content">
<ul class="history__list"></ul>
</div>
</div>
`;

		this.root = this.shadowRoot.querySelector('.history');
		this.showHideButton = this.shadowRoot.querySelector(
			'.history__show-hide'
		);
		this.content = this.shadowRoot.querySelector('.history__content');
		this.list = this.shadowRoot.querySelector('.history__list');



		this.showHideButton.addEventListener('click', () => {
			this.root.classList.toggle('history--is-open');
		});
	}

	setSelected(selected) {
		this.list.querySelectorAll('li').forEach((li) => {
			li.classList.remove('history__item--is-current');
		});

		this.list.children[selected]?.classList?.add('history__item--is-current');
	}

	/**
		* @param {HTMLElement[]} items
		*/
	append(...items) {
		items.forEach(item => {
			const listItem = document.createElement('li');
			listItem.classList.add('history__item');
			listItem.appendChild(item);
			this.list.appendChild(listItem);
		})
	}

	clear() {
		this.list.innerHTML = '';
	}
}

customElements.define('x-history', HistoryElement);

/**
	* @template T
	*/
class StateHistory {
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
		this.onMove?.()
	}

	/**
		* @param {number} relative
		* @return {T}
		*/
	go(relative) {
		if ((relative | 0) !== relative) throw new Error('where must be an integer');

		return this.goTo(clamp(this.head + relative, 0, this.history.length - 1))
	}

	/**
		* @param {number} where
		* @return {T}
		*/
	goTo(where) {
		if ((where | 0) !== where) throw new Error('where must be an integer');
		if (where < 0 || where >= this.history.length) throw new Error('where must be in the range [0, history.length)');

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

/**
	* @template T
	* @param {HistoryNode<T>} nodePrev
	* @param {HistoryNode<T>} node
	* @param {HTMLElement} element
	*/
function diff(nodePrev, node, element) {
	if (nodePrev === node) return;


}

/**
	* @template T
	* @typedef {{created: number; id: string; state: T; children: HistoryNode<T>[], parent: null|HistoryNode<T>}} HistoryNode
	*/
/**
	* @template T
	*/
class HistoryTree {

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
		if ((relative | 0) !== relative) throw new Error('where must be an integer');

		let node = this.current;
		while (relative < 0 && node.parent !== null) {
			node = node.parent;
			relative++;
		}

		while (relative > 0 && node.children.length  === 1) {
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

function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

function randId() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


/**
	* @typedef {{transform: Matrix3; thumbnail: HTMLCanvasElement}} HistoryItem
	*/

/**
	* @param {{historyTree: HistoryTree<HistoryItem>}} props
	*/
function HistoryTreeView({historyTree}) {

	// <div class="history">
	// 	<button class="history__show-hide">+</button>
	// 	<div class="history__content">
	// 		<ul class="history__list"></ul>
	// 	</div>
	// </div>

	const [isOpen, setIsOpen] = useState(false);

	const [_, setRefresh] = useState({});
	const [selected, setSelected] = useState(historyTree.current.id);

	useEffect(() => {
		const onChange = () => {
			setRefresh({});
		}
		const onMove = () => {
			setSelected(historyTree.current.id);
		};
		historyTree.onChange.addEventListener('change', onChange);
		historyTree.onMove.addEventListener('move', onMove);

		return () => {
			historyTree.onChange.removeEventListener('change', onChange);
			historyTree.onMove.removeEventListener('move', onMove);
		}
	}, [historyTree]);



	return html`
		<div class=${classNames({
			'history': true,
			'history--is-open': isOpen,
		})}>
			<button class="history__show-hide" onClick=${() => setIsOpen(!isOpen)}>+</button>

			<div class="history__content">
				<${HistoryTreeNodeView}
					class="historyTree"
					historyNode=${historyTree.root}
					selectedNode=${selected}
					onNodeClicked=${nodeId => historyTree.goTo(nodeId)}
				/>
			</div>
		</div>
	`;
}

/**
	* @param {{historyNode: HistoryNode<HistoryItem>; selectedNode: string; onNodeClicked: (nodeId: string) => void}} props
	*/
function HistoryTreeNodeView({historyNode, selectedNode, onNodeClicked}) {
	const contentHolder = useRef(null);

	useEffect(() => {
		if (contentHolder.current) {
			contentHolder.current.append(historyNode.state.thumbnail);
		}
	})

	return html`
	<div
		class=${classNames({
			'historyTree': true,
			'historyTree--is-selected': selectedNode === historyNode.id,
			'historyTree--has-children': historyNode.children.length > 0
		})}
	>
		<div class="historyTree__content" ref=${contentHolder} onClick=${() => onNodeClicked(historyNode.id)} />

		${historyNode.children.length > 0 &&
			html`
			<ul class="historyTree__items">
				${historyNode.children.sort((a, b) => a.created - b.created).map(child =>
					html`
					<li class="historyTree__item" key=${child.id}>
						<${HistoryTreeNodeView}
							historyNode=${child}
							selectedNode=${selectedNode}
							onNodeClicked=${onNodeClicked}
						/>
					</li>
				`)}
			</ul>
		`}
	</div>
	`;
}
