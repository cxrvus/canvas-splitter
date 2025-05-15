import { Notice, Plugin, Modal, App } from 'obsidian';
import { splitNodes } from './nodesplitter';

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
			id: 'split-node',
			name: 'Split Node',

			callback: async () => {
				new TextInputModal(this.app, 'Delimiter?', async (delimiter) => {
					try {
						await splitNodes(this.app, delimiter)
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

class TextInputModal extends Modal {
	prompt: string;
	onSubmit: (result: string) => void;

	constructor(app: App, prompt: string, onSubmit: (result: string) => void) {
		super(app);
		this.prompt = prompt;
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl('h2', { text: this.prompt });

		const inputEl = contentEl.createEl('input', {
			type: 'text',
			placeholder: 'line break',
		});

		inputEl.style.width = '100%';
		inputEl.focus();

		inputEl.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				this.onSubmit(inputEl.value);
				this.close();
			}
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
