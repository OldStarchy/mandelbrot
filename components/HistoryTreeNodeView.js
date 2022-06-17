import {
	useEffect,
	useRef,
} from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';
import html from '../util/html.js';
import requireCss from '../util/requireCss.js';

requireCss('./HistoryTreeNodeView.css', import.meta.url);

/**
 * @param {{historyNode: HistoryNode<HistoryItem>; selectedNode: string; onNodeClicked: (nodeId: string) => void}} props
 */
export default function HistoryTreeNodeView({
	historyNode,
	selectedNode,
	onNodeClicked,
}) {
	const contentHolder = useRef(/** @type {HTMLDivElement|null} */ (null));

	useEffect(() => {
		if (contentHolder.current) {
			contentHolder.current.append(historyNode.state.thumbnail);
		}
	});

	return html`
		<div
			class=${classNames({
				historyTree: true,
				'historyTree--is-selected': selectedNode === historyNode.id,
				'historyTree--has-children': historyNode.children.length > 0,
			})}
		>
			<div
				class="historyTree__content"
				ref=${contentHolder}
				onClick=${() => onNodeClicked(historyNode.id)}
			/>

			${historyNode.children.length > 0 &&
			html`
				<ul class="historyTree__items">
					${historyNode.children
						.sort((a, b) => a.created - b.created)
						.map(
							(child) => html`
								<li class="historyTree__item" key=${child.id}>
									<${HistoryTreeNodeView}
										historyNode=${child}
										selectedNode=${selectedNode}
										onNodeClicked=${onNodeClicked}
									/>
								</li>
							`
						)}
				</ul>
			`}
		</div>
	`;
}
