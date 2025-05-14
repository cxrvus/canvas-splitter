import { Plugin } from 'obsidian';

interface UtilPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: UtilPluginSettings = {
	mySetting: 'default'
}

export default class UtilPlugin extends Plugin {
	settings: UtilPluginSettings;

	async onload() {
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
