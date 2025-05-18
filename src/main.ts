import { Notice, Plugin } from 'obsidian';
import { splitNodes } from './splitter';
import { DelimiterPrompt } from './util';

interface CanvasSplitterSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: CanvasSplitterSettings = {
	mySetting: 'default'
}

export default class CanvasSplitterPlugin extends Plugin {
	settings: CanvasSplitterSettings;

	async onload() {
		this.addCommand({
			id: 'split-node',
			name: 'Split Node',

			callback: async () => {
				new DelimiterPrompt(this.app, 'Delimiter?', false, async (result) => {
					try {
						await splitNodes(this.app, result.delimiter)
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
