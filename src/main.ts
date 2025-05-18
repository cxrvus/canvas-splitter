import { Notice, Plugin } from 'obsidian';
import { splitNodes } from './splitter';
import { DelimiterPrompt } from './util';
import { mergeNodes } from './merger';

interface CanvasSplitterSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: CanvasSplitterSettings = {
	mySetting: 'default'
}

export default class CanvasSplitterPlugin extends Plugin {
	settings: CanvasSplitterSettings;

	async onload() {

		// todo: better error handling (prompt errors are uncaught)

		this.addCommand({
			id: 'split-node',
			name: 'Split Node(s)',

			callback: async () => {
				new DelimiterPrompt(this.app, 'Delimiter?', async (delimiter) => {
					try {
						await splitNodes(this.app, delimiter)
					} catch (e) {
						new Notice(e.message)
					}
				}).open();
			},
		});

		this.addCommand({
			id: 'merge-nodes',
			name: 'Merge Nodes',

			callback: async () => {
				new DelimiterPrompt(this.app, 'Delimiter?', async (delimiter) => {
					try {
						await mergeNodes(this.app, delimiter)
					} catch (e) {
						new Notice(e.message)
					}
				}).open();
			},
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
