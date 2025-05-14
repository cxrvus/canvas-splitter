import { ItemView, App } from 'obsidian';
import { randomBytes } from 'crypto';

interface CanvasFile {
	nodes: Node[]
}

interface Node {
	id: string,
	text: string
}


export const splitNode = async (app: App, delimiter: string) => {
	const ids = getSelectedNodeIDs(app);

	if (ids?.length === 0) throw new Error('no canvas nodes selected!');
	else if (ids?.length > 1) throw new Error('multiple nodes selected!');

	const id = ids[0];

	const file = app.workspace.getActiveFile();
	if (!file) throw new Error('no active file!');

	const content = await app.vault.read(file);
	const canvas = JSON.parse(content) as CanvasFile;
	
	const target = canvas.nodes.find(x => x.id == id);
	if (!target) throw new Error('could not find node with provided ID');

	const fragments = target?.text.trim().split(delimiter || '\n').map(x => x.trim());

	fragments?.forEach(fragment => {
		const id = randomBytes(8).toString('hex');
		canvas.nodes.push({ ...target, id, text: fragment });
	});

	canvas.nodes.remove(target);

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
