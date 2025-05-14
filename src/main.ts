import { Notice, Plugin } from 'obsidian';
import { getSelectedNodeIDs } from './nodesplitter';

interface UtilPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: UtilPluginSettings = {
	mySetting: 'default'
}

export default class UtilPlugin extends Plugin {
	settings: UtilPluginSettings;

	async onload() {
		this.addCommand({
			id: 'log-selected-nodes',
			name: 'Log Selected Node IDs',

			callback: () => {
				const ids = getSelectedNodeIDs(this.app);

				let message;

				if (ids === null) message = 'view is not a canvas view!'
				else if (ids?.length === 0) message = 'node canvas nodes selected!'
				else message = 'selected nodes: ' + ids.join(', ')

				console.log(message);
				new Notice(message);
			},
		});
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
