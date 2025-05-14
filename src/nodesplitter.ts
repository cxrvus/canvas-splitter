import { ItemView, App } from 'obsidian';

export const getSelectedNodeIDs = (app: App): string[] | null => {
	const canvasView = app.workspace.getActiveViewOfType(ItemView);

	if (canvasView?.getViewType() !== "canvas") return null;

	const canvas = (canvasView as any).canvas;
	const selection: any = Array.from( canvas.selection);
	const ids = selection.map((node: any) => node.id)

	return ids
}
