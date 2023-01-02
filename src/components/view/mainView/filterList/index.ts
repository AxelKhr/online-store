import "./style.scss";

export type FilterListItem = {
  name: string;
  count: number;
  total: number;
  checked: boolean;
}

export function createFilterList(data: FilterListItem[]): HTMLUListElement {
  const list = document.createElement('ul');
  list.classList.add('filter__list');
  data.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list__item');
    const label = document.createElement('label');
    const checkBox = document.createElement('input');
    checkBox.dataset.name = item.name;
    checkBox.type = 'checkbox';
    checkBox.checked = item.checked;
    const box = document.createElement('div');
    const name = document.createElement('p');
    name.textContent = item.name;
    const counts = document.createElement('p');
    counts.textContent = `${item.count} / ${item.total}`;
    box.append(name, counts);
    label.append(checkBox, box);
    listItem.append(label);
    list.append(listItem);
  });
  return list;
}
