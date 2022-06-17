interface HistoryItem {
	transform: Matrix3;
	thumbnail: HTMLCanvasElement;
}

interface HistoryNode<T> {
	created: number;
	id: string;
	state: T;
	children: HistoryNode<T>[];
	parent: null | HistoryNode<T>;
}

const classNames: (...args: any) => string;

declare module 'https://unpkg.com/htm?module' {
	export function bind(
		createElement: (type: any, props?: any, ...children: any[]) => any
	): (strings: TemplateStringsArray, ...values: any[]) => any;
}

declare module 'https://unpkg.com/preact@latest?module' {
	function createElement(type: any, props?: any, ...children: any[]): any;
	export const h: typeof createElement;
	export function render(
		element: any,
		target: any,
		callback?: () => void
	): any;
}

declare module 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module' {
	export function useState<T>(
		initialState: T | (() => T)
	): [T, (newState: T | ((oldState: T) => T)) => void];
	export function useEffect(
		effect: () => void | (() => void),
		inputs?: any[]
	): void;
	export function useRef<T>(initialValue: T): { current: T };
}
