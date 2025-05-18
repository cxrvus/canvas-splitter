import { App } from 'obsidian';
import { CanvasFile, getSelectedNodeIDs, loadCanvas, saveCanvas } from './canvas';
import { randomId } from './util';

// todo: make these customizable
const LINE_CHARS = 48;
const LINE_WIDTH = 500;
const LINE_HEIGHT = 30;

export const splitNodes = async (app: App, delimiter: string) => {
	const ids = getSelectedNodeIDs(app);
	if (ids?.length === 0) throw new Error('no canvas nodes selected!');

	const canvas = await loadCanvas(app);

	ids.forEach(id => splitNode(canvas, delimiter, id))

	await saveCanvas(app, canvas);
}

const splitNode = (canvas: CanvasFile, delimiter: string, id: string) => {
	const origin = canvas.content.nodes.find(x => x.id == id);
	if (!origin) throw new Error('could not find node with provided ID');

	const fragments = origin?.text.trim().split(delimiter || '\n').map(x => x.trim());

	fragments
		?.filter(fragment => fragment)
		.forEach(fragment => {
			const lineCount = fragment.split('\n')
				.map(line => Math.floor(line.length / LINE_CHARS))
				.reduce((a, b) => a + b)
			;

			// todo: better width / height calculation

			const height = (lineCount + 2) * LINE_HEIGHT;

			const node = {
				...origin,
				id: randomId(),
				width: LINE_WIDTH,
				height,
				text: fragment,
			};

			canvas.content.nodes.push(node);
	});

	canvas.content.nodes.remove(origin);
}
