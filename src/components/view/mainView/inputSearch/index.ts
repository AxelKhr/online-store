import "./style.scss";
import createButtonGeneral from "../../elements/buttons/general";

export type InputSearchData = {
    type: string;
    value: string;
}

export class InputSearch {
    content: HTMLElement;
    private inputEdit: HTMLInputElement;
    private select: HTMLSelectElement;
    onChange!: (type: string, value: string) => void;

    constructor() {
        this.content = document.createElement('div');
        this.content.classList.add('filter__search');

        this.inputEdit = document.createElement('input');
        this.inputEdit.type = 'text';
        this.inputEdit.placeholder = 'Search';
        this.inputEdit.autocomplete = 'off';
        const button = createButtonGeneral('search__button');
        button.textContent = 'Search';
        this.select = document.createElement('select');
        const option1 = document.createElement('option');
        option1.textContent = 'Title';
        option1.value = 'title';
        const option2 = document.createElement('option');
        option2.textContent = 'Category';
        option2.value = 'category';
        const option3 = document.createElement('option');
        option3.textContent = 'Brand';
        option3.value = 'brand';
        this.select.append(option1, option2, option3);

        this.content.append(this.select, this.inputEdit, button,);

        button.addEventListener('click', () => {
            this.changeData();
        })
        this.inputEdit.addEventListener('change', () => {
            this.changeData();
        })
    }

    private changeData() {
        if (this.onChange !== undefined) {
            this.onChange(this.select.value, this.inputEdit.value);
        }
    }

    setData(data: InputSearchData) {
        this.inputEdit.value = data.value;
        if (data.value.length > 0) {
            this.select.value = data.type;
        }
    }
}