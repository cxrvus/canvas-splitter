import { App, TFile } from 'obsidian';

export interface CanvasFile {
	file: TFile,
	content: { nodes: CanvasNode[] }
}

export interface CanvasNode {
	id: string,
	text: string,
	width: number,
	height: number,
	x: number,
	y: number,
	color?: string,
}

export const getSelectedNodeIDs = (app: App): string[] => {
	const file = app.workspace.getActiveFile();
	if (!file) throw new Error('no active file!');

	const leaves = app.workspace.getLeavesOfType("canvas");

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const canvasLeaf = leaves.find(leaf => (leaf.view as any).file?.path === file.path);
	if (!canvasLeaf) throw new Error('no canvas view for current file!');

	const canvasView = canvasLeaf.view;
	if (canvasView?.getViewType() !== "canvas") throw new Error('view is not a canvas view!');

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const canvas = (canvasView as any).canvas;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const selection: any = Array.from(canvas.selection);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const ids = selection.map((node: any) => node.id)

	return ids;
}

export const loadCanvas = async (app: App): Promise<CanvasFile> => {
	const file = app.workspace.getActiveFile();
	if (!file) throw new Error('no active file!');

	const rawContent = await app.vault.read(file);
	const content = JSON.parse(rawContent) as { nodes: CanvasNode[] }

	return { file, content }
}

export const saveCanvas = async (app: App, canvas: CanvasFile) => {
	await app.vault.modify(canvas.file, JSON.stringify(canvas.content, null, 2));
}