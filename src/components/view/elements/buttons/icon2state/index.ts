import "./style.scss";

export function createButtonIcon2State(pathImage: string, pathImageChecked: string, ...classNames: string[]): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add('button-icon');
    if (classNames) {
        button.classList.add(...classNames);
    }
    button.dataset.checked = 'false';
    const imageAdd = document.createElement('img');
    imageAdd.classList.add('button__icon-add');
    imageAdd.src = pathImage;
    imageAdd.alt = 'Add';
    imageAdd.width = 20;
    imageAdd.height = 20;
    const box = document.createElement('div');
    const imageRem = document.createElement('img');
    imageRem.classList.add('button__icon-remove');
    imageRem.src = pathImageChecked;
    imageRem.alt = 'Remove';
    imageRem.width = 20;
    imageRem.height = 20;
    box.append(imageRem);
    button.append(imageAdd, box);
    return button;
};

export function setStateButtonIcon2(selClass: string, isChecked: boolean) {
    const button = document.querySelector<HTMLButtonElement>(`.${selClass}.button-icon`);
    if (button) {
        button.dataset.checked = isChecked.toString();
    }
}