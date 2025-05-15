import { ItemView, App } from 'obsidian';
import { randomBytes } from 'crypto';

interface CanvasFile {
	nodes: Node[]
}

interface Node {
	id: string,
	text: string
	height: number,
	width: number
}

// todo: make these customizable
const LINE_CHARS = 48;
const LINE_WIDTH = 500;
const LINE_HEIGHT = 30;

export const splitNode = async (app: App, delimiter: string) => {
	const ids = getSelectedNodeIDs(app);

	if (ids?.length === 0) throw new Error('no canvas nodes selected!');
	else if (ids?.length > 1) throw new Error('multiple nodes selected!');

	const id = ids[0];

	const file = app.workspace.getActiveFile();
	if (!file) throw new Error('no active file!');

	const content = await app.vault.read(file);
	const canvas = JSON.parse(content) as CanvasFile;
	
	const origin = canvas.nodes.find(x => x.id == id);
	if (!origin) throw new Error('could not find node with provided ID');

	const fragments = origin?.text.trim().split(delimiter || '\n').map(x => x.trim());

	fragments
		?.filter(fragment => fragment)
		.forEach(fragment => {
			const id = randomBytes(8).toString('hex');

			const lineCount = fragment.split('\n')
				.map(line => Math.floor(line.length / LINE_CHARS))
				.reduce((a, b) => a + b)
			;

			const height = (lineCount + 2) * LINE_HEIGHT;

			const node = {
				...origin,
				id,
				height,
				width: LINE_WIDTH,
				text: fragment,
			};

			canvas.nodes.push(node);
	});

	canvas.nodes.remove(origin);

	await app.vault.modify(file, JSON.stringify(canvas, null, 2));
}

const getSelectedNodeIDs = (app: App): string[] => {
	const canvasView = app.workspace.getActiveViewOfType(ItemView);
	if (canvasView?.getViewType() !== "canvas") throw new Error('view is not a canvas view!');

	const canvas = (canvasView as any).canvas;
	const selection: any = Array.from(canvas.selection);
	const ids = selection.map((node: any) => node.id)

	return ids;
}
