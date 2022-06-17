//@ts-check
/// <reference path="types.d.ts"/>

import 'https://unpkg.com/classnames';
import { h, render } from 'https://unpkg.com/preact@latest?module';
import HistoryTreeView from './components/HistoryTreeView.js';
import ComplexNumber from './core/ComplexNumber.js';
import HistoryTree from './core/HistoryTree.js';
import iterateMandelbrot from './core/iterateMandelbrot.js';
import Matrix3 from './core/Matrix3.js';
import Vector3 from './core/Vector3.js';
import debounce from './util/debounce.js';

function iterateMandelbrotAndGetPath(c, maxIterations) {
	const path = [];
	let z = new ComplexNumber(0, 0);
	maxIterations = Math.max(1, maxIterations);
	path.push(z.clone());
	for (let i = 0; i < maxIterations; i++) {
		z = z.multiply(z).add(c);
		path.push(z.clone());
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

			const c = new ComplexNumber(transformedPoint.x, transformedPoint.y);
			const result = iterateMandelbrot(c, maxIterations);
			if (result.iterations === maxIterations)
				context.fillStyle = 'black';
			else context.fillStyle = rainbowColour(result.iterations);
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
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	drawMandelbrot(
		canvas,
		width,
		height,
		transform,
		maxIterations,
		new AbortController().signal
	);
	return canvas;
}

window.addEventListener('load', () => {
	let maxIterations = 5000;
	const canvasEle = document.getElementById('canvas');
	if (!(canvasEle instanceof HTMLCanvasElement))
		throw new Error('Invalid canvas element');
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
			thumbnail: createThumbnail(150, 150, transform, maxIterations),
		};
	}
	const history = new HistoryTree(
		createHistoryItem(Matrix3.boundingBox(-2, -2, 2, 2))
	);

	render(
		h(HistoryTreeView, { historyTree: history }, null),
		document.getElementById('history')
	);

	let abortController = new AbortController();

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
	history.onMove.addEventListener('move', () => {
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
			if (localStorage.getItem(`transform${e.keyCode - 48}`)) {
				if (!confirm(`Overwrite saved transform ${e.keyCode - 48}?`))
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
				history.push(
					createHistoryItem(
						Matrix3.fromJson(JSON.parse(savedTransform))
					)
				);
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

			if (history.current !== oldHead) {
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
			const resolution = res.split(' ').map((x) => parseInt(x));

			if (
				resolution.length !== 2 ||
				resolution.some(
					(dimension) =>
						typeof dimension !== 'number' || dimension < 1
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

			(async () => {
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
			})();
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
			const transformedPoint = history
				.currentState()
				.transform.transform(
					new Vector3(
						event.offsetX / canvas.width,
						event.offsetY / canvas.height,
						1
					)
				);

			const c = new ComplexNumber(transformedPoint.x, transformedPoint.y);

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

		const clickEnd = new Vector3(event.offsetX, event.offsetY, 1);

		history.push(
			createHistoryItem(
				history
					.currentState()
					.transform.multiply(
						Matrix3.boundingBox(
							clickStart.x / canvas.width,
							clickStart.y / canvas.height,
							clickEnd.x / canvas.width,
							clickEnd.y / canvas.height
						)
					)
			)
		);
		clickStart = null;

		drawCurrent();
	});
});
