import "./style.scss";

export type FilterListItem = {
    name: string;
    count: number;
    total: number;
    checked: boolean;
}

export function createFilterList(data: FilterListItem[]): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('filter__list-wrapper');
    const list = document.createElement('ul');
    list.classList.add('filter__list');
    data.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list__item');
        listItem.dataset.name = item.name;
        const label = document.createElement('label');
        (item.count > 0) || label.classList.add('disable');
        const checkBox = document.createElement('input');
        checkBox.classList.add('item__check-box', 'check-box');
        checkBox.dataset.name = item.name;
        checkBox.type = 'checkbox';
        checkBox.checked = item.checked;
        const box = document.createElement('div');
        const name = document.createElement('p');
        name.textContent = item.name;
        const counts = document.createElement('p');
        counts.classList.add('item__counts');
        counts.textContent = `${item.count} / ${item.total}`;
        box.append(name, counts);
        label.append(checkBox, box);
        listItem.append(label);
        list.append(listItem);
    });
    wrapper.append(list);
    return wrapper;
}

export function updateFilterList(parentSelClass: string, data: FilterListItem[]): void {
    data.forEach((item) => {
        const parentSelector = `.${parentSelClass} li[data-name="${item.name}"]`;
        const checkBox = document.querySelector<HTMLInputElement>(parentSelector + ' .item__check-box');
        if (checkBox) {
            checkBox.checked = item.checked;
        }
        const counts = document.querySelector<HTMLParagraphElement>(parentSelector + ' .item__counts');
        if (counts) {
            counts.textContent = `${item.count} / ${item.total}`;
        }
        const label = document.querySelector<HTMLLabelElement>(parentSelector + ' label');
        if (label) {
            if (item.count > 0) {
                label.classList.remove('disable');
            } else {
                label.classList.add('disable');
            }
        }
    });

}
