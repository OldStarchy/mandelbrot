import {
	useEffect,
	useState,
} from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';
import html from '../util/html.js';
import requireCss from '../util/requireCss.js';
import HistoryTreeNodeView from './HistoryTreeNodeView.js';

requireCss('./HistoryTreeView.css', import.meta.url);

/**
 * @template T
 * @typedef {import('../core/HistoryTree').default<T>} HistoryTree
 */

/**
 * @param {{historyTree: HistoryTree<HistoryItem>}} props
 */
export default function HistoryTreeView({ historyTree }) {
	const [isOpen, setIsOpen] = useState(false);

	const [_, setRefresh] = useState({});
	const [selected, setSelected] = useState(historyTree.current.id);

	useEffect(() => {
		const onChange = () => {
			setRefresh({});
		};
		const onMove = () => {
			setSelected(historyTree.current.id);
		};
		historyTree.onChange.addEventListener('change', onChange);
		historyTree.onMove.addEventListener('move', onMove);

		return () => {
			historyTree.onChange.removeEventListener('change', onChange);
			historyTree.onMove.removeEventListener('move', onMove);
		};
	}, [historyTree]);

	return html`
		<div
			class=${classNames({
				history: true,
				'history--is-open': isOpen,
			})}
		>
			<button
				class="history__show-hide"
				onClick=${() => setIsOpen(!isOpen)}
				>+</button
			>

			<div class="history__content">
				<${HistoryTreeNodeView}
					class="historyTree"
					historyNode=${historyTree.root}
					selectedNode=${selected}
					onNodeClicked=${(nodeId) => historyTree.goTo(nodeId)}
				/>
			</div>
		</div>
	`;
}
