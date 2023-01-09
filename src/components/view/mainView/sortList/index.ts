import "./style.scss";

export type SortListData = Map<string, string>;

export class SortList {
    content: HTMLElement;
    private selector: HTMLSelectElement;
    onChange!: (current: string) => void;

    constructor(list: SortListData, current: string) {
        this.content = document.createElement('div');
        this.content.classList.add('sort-list');
        this.selector = document.createElement('select');
        [...list.entries()].forEach((item) => {
            const option = document.createElement('option');
            option.value = item[0];
            option.textContent = item[1];
            this.selector.append(option);
        });
        this.selector.value = current;
        this.selector.addEventListener('change', () => {
            if (this.onChange) {
                this.onChange(this.selector.value);
            }
        })
        this.content.append(this.selector);
    }

    setData(current: string) {
        this.selector.value = current;
    }
}
