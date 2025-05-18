import { App } from 'obsidian';
import { CanvasNode, getSelectedNodeIDs, loadCanvas, saveCanvas } from './canvas';
import { randomId } from './util';

export const mergeNodes = async (app: App, delimiter: string) => {
	const ids = getSelectedNodeIDs(app);
	if (ids?.length === 0) throw new Error('no canvas nodes selected!');
	if (ids?.length === 1) throw new Error('please select more than one node!');

	const canvas = await loadCanvas(app);

	const originNodes = ids.map(id => canvas.content.nodes.find(node => node.id === id)) as CanvasNode[];

	const fullDelimiter = delimiter + ' '
	
	// prepending delimiter to full text to be used for bullet lists
	const text = fullDelimiter + originNodes.map(node => node.text.trim()).join(fullDelimiter).trim();

	const targetTransform = getBoundaryRect(originNodes);

	const targetNode = {
		...originNodes[0],
		...targetTransform,
		id: randomId(),
		text,
	}

	delete targetNode.color;

	canvas.content.nodes.push(targetNode);

	originNodes.forEach(node => canvas.content.nodes.remove(node));

	await saveCanvas(app, canvas);
}

type NodeTransform = {
	width: number;
	height: number;
	x: number;
	y: number;
}

const getBoundaryRect = (nodes: CanvasNode[]): NodeTransform => {
	if (nodes.length === 0) return { width: 0, height: 0, x: 0, y: 0 };

	let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

	for (const node of nodes) {
		const { x, y, width, height } = node;
		minX = Math.min(minX, x);
		minY = Math.min(minY, y);
		maxX = Math.max(maxX, x + width);
		maxY = Math.max(maxY, y + height);
	}

	const rectWidth = maxX - minX;
	const rectHeight = maxY - minY;

	return { width: rectWidth, height: rectHeight, x: minX, y: minY };
}
