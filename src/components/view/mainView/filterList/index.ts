import "./style.scss";

function createFilterList(data: Set<string>, category?: string[]): HTMLUListElement {
  const list = document.createElement('ul');
  list.classList.add('filter__list');
  data.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list__item');
    const link = document.createElement('a');
    link.href = '#';
    const label = document.createElement('label');
    const checkBox = document.createElement('input');
    category?.forEach((el) => {
      if(item === el) checkBox.checked = true; 
    });
    checkBox.type = 'checkbox';
    checkBox.name = item;
    label.append(checkBox, item);
    link.append(label);
    listItem.append(link);
    list.append(listItem);
  });
  return list;
}

export { createFilterList };