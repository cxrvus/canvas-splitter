import { randomBytes } from 'crypto';
import { App, Modal } from 'obsidian';

export const randomId = () => randomBytes(8).toString('hex');

// todo: implement preset system
export class DelimiterPrompt extends Modal {
	prompt: string;
	onSubmit: (result: string) => void;

	//temp solution until presets are implemented
	multiline: boolean;

	constructor(app: App, prompt: string, onSubmit: (result: string) => void) {
		super(app);
		this.prompt = prompt;
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;

		// header
		contentEl.createEl('h2', { text: this.prompt });

		// delimiter string
		const delimiterInput = contentEl.createEl('input', {
			type: 'text',
		});

		delimiterInput.style.display = 'block';
		delimiterInput.style.width = '100%';

		// fancy slider checkbox
		const checkbox = createMultilineSlider(contentEl);
		this.multiline = checkbox.checked;
		checkbox.addEventListener("change", () => {
			this.multiline = checkbox.checked;
		});

		// events
		delimiterInput.focus();

		delimiterInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {

				const multilinePrefix = this.multiline ? '\n' : '';
				const delimiter = multilinePrefix + delimiterInput.value.trim();

				if (!delimiter) throw new Error('please enter a delimiter!');

				this.onSubmit(delimiter);
				this.close();
			}
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

const createMultilineSlider = (contentEl: HTMLElement): HTMLInputElement => {
	const checkboxDiv = contentEl.createDiv();
	checkboxDiv.style.marginTop = "16px";
	checkboxDiv.style.display = "flex";
	checkboxDiv.style.alignItems = "center";

	const multilineLabel = checkboxDiv.createEl("label", { text: "Multiline" });
	multilineLabel.style.marginRight = "8px";

	const toggleContainer = checkboxDiv.createEl("span");
	toggleContainer.addClass("canvas-splitter-toggle-container");

	const checkbox = toggleContainer.createEl("input", {
		type: "checkbox",
	});
	checkbox.addClass("canvas-splitter-toggle-checkbox");
	checkbox.checked = true;

	const slider = toggleContainer.createEl("span");
	slider.addClass("canvas-splitter-toggle-slider");

	const circle = document.createElement("span");
	circle.className = "canvas-splitter-toggle-circle";
	slider.appendChild(circle);

	toggleContainer.appendChild(checkbox);
	toggleContainer.appendChild(slider);

	slider.addEventListener('click', () => {
		checkbox.checked = !checkbox.checked;
		checkbox.dispatchEvent(new Event('change'));
	});

	contentEl.appendChild(checkboxDiv);

	return checkbox;
}
