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
        const boxGrid = document.createElement('div');
        const imageGrid = document.createElement('img');
        imageGrid.src = './assets/img/view_grid.svg';
        imageGrid.alt = 'Grid';
        imageGrid.width = 20;
        imageGrid.height = 20;
        boxGrid.append(imageGrid);
        buttonGrid.append(radioGrid, boxGrid);
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
        const boxLines = document.createElement('div');
        const imageLines = document.createElement('img');
        imageLines.src = './assets/img/view_lines.svg';
        imageLines.alt = 'Lines';
        imageLines.width = 20;
        imageLines.height = 20;
        boxLines.append(imageLines);
        buttonLines.append(radioLines, boxLines);
        this.content.append(buttonGrid, buttonLines);
        (this.content as HTMLFormElement).viewControl.value = value;
    }
}