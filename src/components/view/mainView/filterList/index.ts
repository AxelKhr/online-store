import "./style.scss";

function createFilterList(data: Set<string>): HTMLUListElement {
  const list = document.createElement('ul');
  list.classList.add('filter__list');
  data.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list__item');
    const label = document.createElement('label');
    const checkBox = document.createElement('input');
    checkBox.dataset.name = item;
    checkBox.type = 'checkbox';
    label.append(checkBox, item);
    listItem.append(label);
    list.append(listItem);
  });
  return list;
}

export { createFilterList };