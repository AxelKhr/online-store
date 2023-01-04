import "./style.scss";

export class ViewControl {
    content: HTMLElement;
    onChange!: (value: string) => void;

    constructor(value: string) {
        this.content = document.createElement('form');
        this.content.classList.add('view__buttons');
        const buttonGrid = document.createElement('div');
        buttonGrid.classList.add('view-button')
        const radioGrid = document.createElement('input');
        radioGrid.type = 'radio';
        radioGrid.name = 'viewControl';
        radioGrid.value = 'grid';
        radioGrid.addEventListener('change', () => {
            if (this.onChange) {
                this.onChange('grid');
            }
        });
        const imageGrid = document.createElement('div');
        imageGrid.textContent = 'G';
        buttonGrid.append(radioGrid, imageGrid);
        const buttonLines = document.createElement('div');
        buttonLines.classList.add('view-button')
        const radioLines = document.createElement('input');
        radioLines.type = 'radio';
        radioLines.name = 'viewControl';
        radioLines.value = 'lines';
        radioLines.addEventListener('change', () => {
            if (this.onChange) {
                this.onChange('lines');
            }
        });
        const imageLines = document.createElement('div');
        imageLines.textContent = 'L';
        buttonLines.append(radioLines, imageLines);
        this.content.append(buttonGrid, buttonLines);
        (this.content as HTMLFormElement).viewControl.value = value;
    }
}