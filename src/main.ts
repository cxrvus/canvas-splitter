import { Notice, Plugin, Modal, App } from 'obsidian';
import { splitNodes } from './splitter';

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
				new DelimiterPrompt(this.app, 'Delimiter?', true, async (result) => {
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

export type delimiterPromptResult = {
	delimiter: string,
	multiline: boolean,
}

// todo: implement preset system
export class DelimiterPrompt extends Modal {
	prompt: string;
	onSubmit: (result: delimiterPromptResult) => void;

	//temp solution until presets are implemented
	hasMultilineOption: boolean;

	constructor(app: App, prompt: string, hasMultilineOption: boolean, onSubmit: (result: delimiterPromptResult) => void) {
		super(app);
		this.prompt = prompt;
		this.onSubmit = onSubmit;
		this.hasMultilineOption = hasMultilineOption;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl('h2', { text: this.prompt });

		const delimiterInput = contentEl.createEl('input', {
			type: 'text',
			placeholder: 'line break',
		});

		delimiterInput.style.display = 'block';
		delimiterInput.style.width = '100%';

		const checkboxDiv = contentEl.createDiv();
		checkboxDiv.style.marginTop = '16px';

		const multilineLabel = checkboxDiv.createEl('label', { text: 'Multiline?' });
		const multilineCheckbox = multilineLabel.createEl('input', {
			type: 'checkbox'
		});

		multilineCheckbox.checked = true;
		multilineCheckbox.style.marginLeft = '8px';

		contentEl.appendChild(checkboxDiv);

		delimiterInput.style.width = '100%';
		delimiterInput.focus();

		delimiterInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				const result = { delimiter: delimiterInput.value, multiline: false }
				this.onSubmit(result);
				this.close();
			}
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
