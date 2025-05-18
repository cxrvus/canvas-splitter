import { App, ItemView, TFile } from 'obsidian';

export interface CanvasFile {
	file: TFile,
	content: { nodes: Node[] }
}

export interface Node {
	id: string,
	text: string,
	height: number,
	width: number,
}

export const getSelectedNodeIDs = (app: App): string[] => {
	const canvasView = app.workspace.getActiveViewOfType(ItemView);
	if (canvasView?.getViewType() !== "canvas") throw new Error('view is not a canvas view!');

	const canvas = (canvasView as any).canvas;
	const selection: any = Array.from(canvas.selection);
	const ids = selection.map((node: any) => node.id)

	return ids;
}

export const loadCanvas = async (app: App): Promise<CanvasFile> => {
	const file = app.workspace.getActiveFile();
	if (!file) throw new Error('no active file!');

	const rawContent = await app.vault.read(file);
	const content = JSON.parse(rawContent) as { nodes: Node[] }

	return { file, content }
}

export const saveCanvas = async (app: App, canvas: CanvasFile) => {
	await app.vault.modify(canvas.file, JSON.stringify(canvas, null, 2));
}